/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */
const _ = require('lodash');

module.exports = (restriction, data, scope) => {
  const limit = restriction[1];
  const container = restriction[2];
  _.each(data, exercise => {
    if (_.chain(container).size().isEqual(limit).value()) {
      return;
    }
    const newExercise = _.chain(scope.exercises)
      .filter(e => _.isEqual(e.machine_exercise_id, exercise.machine_exercise_id)).first().value();
    const notRepeatedAtAll = !_.chain(scope.circles).flatten().includes(newExercise).value();
    const notRepeatedInCircle = !_.chain(container).includes(newExercise).value();

    if (notRepeatedInCircle && (notRepeatedAtAll ||
      _.chain(scope.circles).flatten()
        .size().gte(_.size(scope.exercises))
        .value())) {
      container.push(newExercise);
    }
  });
};
