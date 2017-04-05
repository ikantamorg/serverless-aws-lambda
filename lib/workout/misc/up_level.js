/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */

const _ = require('lodash');
const Constants = require('../../shared/constants');

const path = 'workout_exercise.ProgramExercise.machine_exercise_id';

const compare = (result1, result2, comparator) =>
  _.chain(Constants.WORKOUT.WORKOUT_UP_LEVEL_INDICATORS)
    .map(indicator => comparator(result1[indicator], _.get(result2, indicator)))
    .includes(false).value();

module.exports = results => _.chain(results).first()
  .map(current => {
    const prev = _.chain(results).last().find(o => _.eq(_.get(o, path), _.get(current, path))).value();
    return _.isObject(prev) ? compare(current, prev, _.gt) : true;
  })
  .includes(false)
  .value();
