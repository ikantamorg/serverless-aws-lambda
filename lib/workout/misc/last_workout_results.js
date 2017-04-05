/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */

const Workout = require('../../../lib/models/workout').associate();
const WorkoutResult = require('../../../lib/models/workout_exercise_result').associate();
const Promise = require('bluebird');
const Constants = require('../../shared/constants');

module.exports = (userId, limit) => Workout.findAll({
  where: {
    user_id: userId,
    status: Constants.WORKOUT.STATUS.FINISHED,
  },
  include: [{
    model: WorkoutResult,
    required: true,
  }],
  order: [['created_at', 'DESC']],
  limit: limit || 1,
  rejectOnEmpty: true,
})
  .then(result => Promise.map(result, m => WorkoutResult
    .scope({ method: ['fromWorkout', m.id] }).findAll({ rejectOnEmpty: true })));
