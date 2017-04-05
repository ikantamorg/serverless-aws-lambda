const sequelize = require('sequelize');
const WorkoutService = require('../../../lib/services/workout');
const Errors = require('../../../lib/shared/errors');
const _ = require('lodash');

const updateParams = ['file'];

module.exports.handler = (event, context, callback) => {
  WorkoutService.saveExerciseResultRawData(event.exercise_id, _.pick(event.requestParams, updateParams))
    .then(data => callback(null, _.omit(data.toJSON(), updateParams)))
    .catch(sequelize.EmptyResultError,
      () => Errors.notFoundError(callback, `Exercise with id = ${event.exercise_id} not found`))
    .catch(sequelize.ValidationError, e => Errors.validationError(callback, e))
    .catch(e => Errors.internalError(callback, e));
};
