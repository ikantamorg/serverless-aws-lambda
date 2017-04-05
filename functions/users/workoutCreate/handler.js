const UserInfo = require('../../../lib/helpers/user_info');
const InstitutionUser = require('../../../lib/models/institution_user');
const Sequelize = require('sequelize');
const Errors = require('../../../lib/shared/errors');
const workoutCreator = require('../../../lib/workout/create_and_save_workout_by_user');

module.exports.handler = (event, context, callback) => {
  InstitutionUser.findOne({
    where: {
      user_tag: event.user_tag,
    },
    rejectOnEmpty: true,
  })
    .then(user => {
      UserInfo.getUserInfoById(user.user_id, (error, serializedUser) => {
        if (error) {
          return callback(error);
        }
        return workoutCreator(serializedUser).then(model => callback(null, model))
          .catch(Sequelize.EmptyResultError,
            e => Errors.notFoundError(callback, 'Looks like you have no previous results', e));
      });
    })
    .catch(Sequelize.EmptyResultError,
      e => Errors.notFoundError(callback, `Resource with user_tag=${event.user_tag}`, e))
    .catch(e => Errors.internalError(callback, e));
};
