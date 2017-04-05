const WorkoutService = require('../../../lib/services/workout');
const sequelize = require('sequelize');
const Errors = require('../../../lib/shared/errors');
const _ = require('lodash');

const updateParams = ['date', 'completed', 'balance', 'movement', 'range', 'strength', 'symmetry', 'qom', 'time',
  'feedback'];

module.exports.handler = (event, context, callback) => {
  WorkoutService.saveExerciseResult(event.exercise_id, _.pick(event.requestParams, updateParams))
    .then(data => WorkoutService.completeWorkout(data.workout_id)
      .finally(() => callback(null, data)))
    .catch(sequelize.EmptyResultError,
      e => Errors.notFoundError(callback, `Exercise with id = ${event.exercise_id} not found`, e))
    .catch(sequelize.ValidationError, e => Errors.validationError(callback, e))
    .catch(e => Errors.internalError(callback, e));
};

