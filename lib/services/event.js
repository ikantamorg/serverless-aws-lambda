/**
 * BBE-113. Generate workout data
 * https://blumcorp.atlassian.net/browse/BAD-59
 */

const EventLog = require('../../lib/models/event_log');
const Constants = require('../../lib/shared/constants');
const _ = require('lodash');
const sequelize = require('sequelize');

const type = model => {
  if (model instanceof sequelize.Instance) {
    return _.chain(model.$modelOptions.name.singular).camelCase().upperFirst().value();
  }
  return model.type;
};

const paramsMapper = (source, target, scope) => ({
  scope,
  source_id: source.id,
  source_type: type(source),
  action: Constants.EVENT_LOG.ACTIONS.CREATE,
  target_id: target.id,
  target_type: type(target),
});

const createEvent = (source, target, scope) =>
  EventLog.create(paramsMapper(source, target, scope));

const changeEvent = (source, target, scope) =>
  EventLog.create(_.merge(paramsMapper(source, target, scope),
    { action: Constants.EVENT_LOG.ACTIONS.CHANGE }));

module.exports = {
  createEvent,
  changeEvent,
};
