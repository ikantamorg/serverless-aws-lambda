const WorkoutService = require('../../../lib/services/workout');
const Errors = require('../../../lib/shared/errors');
const sequelize = require('../../../lib/db/connector');

module.exports.handler = (event, context, callback) => {
  WorkoutService.saveFeedback(event.exercise_id, event.requestParams.feedback)
    .then(data => callback(null, data))
    .catch(sequelize.EmptyResultError,
      e => Errors.notFoundError(callback, `Resource with id = ${event.exercise_id} not found`, e))
    .catch(sequelize.ValidationError, e => Errors.validationError(callback, e))
    .catch(SyntaxError, ReferenceError, e => Errors.internalError(callback, e));
};

