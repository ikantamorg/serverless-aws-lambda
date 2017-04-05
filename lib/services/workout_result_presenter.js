const _ = require('lodash');
const Constants = require('../shared/constants');

const prepareWorkoutResults = workouts => {
  const results = [];
  _.each(workouts, workout => {
    const workoutResult = workout.workout_result;
    if (workoutResult) {
      _.each(Constants.WORKOUT.INDICATORS, indicator => {
        workoutResult[indicator] = {
          value: workoutResult[indicator],
          min: 0,
          max: 50,
        };
      });
      results.push(workoutResult);
    }
  });
  return results;
};


module.exports = {
  prepareWorkoutResults,
};
