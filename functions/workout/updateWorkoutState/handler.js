const sequelize = require('sequelize');
const Workout = require('../../../lib/services/workout');
const Errors = require('../../../lib/shared/errors');
const _ = require('lodash');

const updateParams = ['date', 'status', 'total_time'];

module.exports.handler = (event, context, callback) => {
  const principalId = event.principalId.split('-');
  const userId = principalId[0];
  Workout.updateWorkout(event.workout_id, userId, _.pick(event.requestParams, updateParams))
    .then(data => Workout.getProgram(data.id))
    .then(data => callback(null, data))
    .catch(sequelize.EmptyResultError,
      e => Errors.notFoundError(callback, `Workout with id = ${event.workout_id} not found`, e))
    .catch(sequelize.ValidationError, e => Errors.validationError(callback, e))
    .catch(e => Errors.internalError(callback, e));
};
