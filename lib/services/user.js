/**
 * BBE-99 - Code refactoring
 * https://blumcorp.atlassian.net/browse/BBE-12
 */

const InstitutionUser = require('../models/institution_user');
const Gym = require('../models/gym');
const ValidationResponseMapper = require('../helpers/validation_mapper');
const User = require('../models/user');
const qs = require('qs');
const BodyMeasurement = require('../models/body_measurement');
const Admin = require('../models/gyms_admin');
const DisabledDisclaimer = require('../models/disabled_disclaimer');
const AdminSettings = require('../models/gyms_admins_settings');
const UserSettings = require('../models/user_settings');
const sequelize = require('../db/connector');
const Sequelize = require('sequelize');
const Promise = require('bluebird');
const UserResponse = require('../helpers/user_response');
const _ = require('lodash');
const crypto = require('crypto');
const Errors = require('../shared/errors');

const BreakSignal = require('../shared/break_signal');


const userResponse = new UserResponse();
const questionnaireService = require('../services/quastionnaire');

const allowUserParams = ['email', 'phone', 'postal_address_line_1', 'postal_address_line_2', 'address_line_1',
  'address_line_2', 'post_address_as_main_address', 'city', 'state', 'country', 'zip_code', 'first_name',
  'last_name', 'gender', 'date_of_birthday', 'emergency_contact_name', 'emergency_contact_phone', 'status', 'coupon',
];

const allowBodyMeParams = ['height', 'weight', 'chest', 'arm', 'waist', 'hips', 'thigh'];


const gymNotFoundedError = (adminId, callback) => {
  const response = {
    status: 404,
    errors: `Can't find gym which include admin with id = ${adminId}`,
  };
  callback(JSON.stringify(response));
};

const institutionNotFoundedError = (userId, callback) => {
  const response = {
    status: 404,
    errors: `Can't find institution which include user with id = ${userId}`,
  };
  callback(JSON.stringify(response));
};

const differentInstitutionError = callback => {
  const response = {
    status: 403,
    errors: 'User and admin are from different institutions',
  };
  callback(JSON.stringify(response));
};

const validationError = (ObjectError, key, callback) => {
  const response = {
    status: 422,
    errors: {},
  };
  response.errors[key] = ValidationResponseMapper.build(ObjectError.errors);
  return callback(JSON.stringify(response));
};

const changeUserTag = (userId, adminId, callback) =>
  Gym.scope({ method: ['includeAdmin', adminId] }).findOne().then(gym => {
    if (!gym) {
      return gymNotFoundedError(adminId, callback);
    }
    return InstitutionUser.findOne({ where: { user_id: userId } }).then(institutionUser => {
      if (!institutionUser) {
        return institutionNotFoundedError(userId, callback);
      }
      if (gym.institution_id !== institutionUser.institution_id) {
        return differentInstitutionError(callback);
      }

      return institutionUser.update({
        user_tag: crypto.randomBytes(32).toString('hex'),
      }).then(user => callback(null, user),
        ObjectError => {
          validationError(ObjectError, 'institutions_users', callback);
        }
      );
    });
  });


const createUser = (event, callback) => {
  const parseParams = qs.parse(event.queryParams);
  const userTag = crypto.randomBytes(32).toString('hex');
  const permittedUserParams = _.pick(parseParams.user, allowUserParams);
  const permittedBodyMeasurementParams = _.pick(parseParams.body_measurements, allowBodyMeParams);

  if (permittedUserParams.post_address_as_main_address === true) {
    permittedUserParams.postal_address_line_1 = permittedUserParams.address_line_1;
    permittedUserParams.postal_address_line_2 = permittedUserParams.address_line_2;
  }

  const adminIdAndAdminTabletId = event.adminIdAndAdminTabletId.split('-');
  const adminId = adminIdAndAdminTabletId[0];
  const scope = {};
  Admin.findById(adminId).then(admin => {
    if (admin) {
      const gymId = admin.gym_id;
      Gym.findById(gymId).then(gym => {
        if (gym) {
          const institutionId = gym.institution_id;
          sequelize.transaction().then(t =>
            User.create(permittedUserParams, { transaction: t })
              .catch(Sequelize.ValidationError, ObjectErrors => {
                validationError(ObjectErrors, 'users', callback);
                t.rollback();
                throw new BreakSignal();
              })
              .then(user => {
                scope.user = user;
                return InstitutionUser.create({
                  institution_id: institutionId,
                  user_id: user.id,
                  user_tag: userTag,
                  gym_id: gym.id,
                  registered_at: new Date(),
                }, { transaction: t });
              })
              .catch(Sequelize.ValidationError, ObjectError => {
                validationError(ObjectError, 'institution_users', callback);
                t.rollback();
                throw new BreakSignal();
              })
              .then(institutionUser => {
                permittedBodyMeasurementParams.user_id = scope.user.id;
                userResponse.addUser(scope.user, institutionUser);
                return BodyMeasurement.create(permittedBodyMeasurementParams, { transaction: t });
              })
              .catch(Sequelize.ValidationError, ObjectErrors => {
                validationError(ObjectErrors, 'body_measurements', callback);
                t.rollback();
                throw new BreakSignal();
              })
              .then(bodyMeasurement => {
                userResponse.addBodyMeasurements(bodyMeasurement);
                return new Promise(resolve => resolve());
              })
              .then(() => questionnaireService(parseParams, scope.user, userResponse, callback, t))
              .then(() => AdminSettings.findOne({
                where: { gyms_admin_id: admin.id }, rejectOnEmpty: true, transaction: t,
              }))
              .catch(Sequelize.EmptyResultError, () => {
                const response = {
                  status: 404,
                  errors: {
                    admin_settings: ["Can't find admin settings"],
                  },
                };
                t.rollback();
                callback(JSON.stringify(response));
                throw new BreakSignal();
              })
              .then(adminSettings => UserSettings.create({
                user_id: scope.user.id,
                language: adminSettings.language,
                unit_of_length: adminSettings.unit_of_length,
                unit_of_weight: adminSettings.unit_of_weight,
              }, { transaction: t }))
              .catch(Sequelize.ValidationError, ObjectError => {
                t.rollback();
                validationError(ObjectError, 'user_settings', callback);
                throw new BreakSignal();
              })
              .then(userSettings => {
                userResponse.addSettings(userSettings);
                callback(null, userResponse.result);
                t.commit();
              })
              .catch(BreakSignal, () => {})
          );
        } else {
          const response = {
            status: 404,
            errors: `Can't find gym with id = ${gymId}`,
          };
          callback(JSON.stringify(response));
        }
      });
    } else {
      const response = {
        status: 404,
        errors: `Can't find admin with id = ${adminId}`,
      };
      callback(JSON.stringify(response));
    }
  });
};


const updateQuestionnaire = (event, callback) => {
  const parseParams = qs.parse(event.queryParams);
  const userId = event.user_id;
  sequelize.transaction().then(t =>
    User.findById(userId, { transaction: t, rejectOnEmpty: true })
      .catch(Sequelize.EmptyResultError,
        e => Errors.notFoundError(callback, `Resource with id = ${userId} not found`, e))
      .then((user) => questionnaireService(parseParams, user, userResponse, callback, t))
      .then(() => {
        callback(null, _.pick(userResponse.result, 'questionnaires'));
        t.commit();
      })
      .catch(BreakSignal, () => {})
  ).catch(() => {
    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback
  });
};

const disableDisclaimer = userId =>
  DisabledDisclaimer.findOrCreate({ where: { user_id: userId } });

module.exports = {
  changeUserTag,
  createUser,
  updateQuestionnaire,
  disableDisclaimer,
};
