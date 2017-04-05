const UserSettings = require('../../../lib/models/user_settings');
const Errors = require('../../../lib/shared/errors');
const _ = require('lodash');
const Sequelize = require('sequelize');

const fields = ['language', 'unit_of_length', 'unit_of_weight'];

exports.handler = (event, context, callback) => {
  const userIdAndMachineId = event.userIdAndMachineId.split('-');
  const userId = userIdAndMachineId[0];

  UserSettings.findOne({ where: { user_id: userId } })
    .then(settings => settings.update(_.pick(event.queryParams, fields)))
    .then(data => callback(null, data))
    .catch(Sequelize.ValidationError, e => Errors.validationError(callback, e))
    .catch(e => Errors.internalError(callback, e));
};
