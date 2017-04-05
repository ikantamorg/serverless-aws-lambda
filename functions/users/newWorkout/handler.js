const UserInfo = require('../../../lib/helpers/user_info');
const Sequelize = require('sequelize');
const Errors = require('../../../lib/shared/errors');
const workoutCreator = require('../../../lib/workout/create_and_save_workout_by_user');
const WorkoutService = require('../../../lib/services/workout');

module.exports.handler = (event, context, callback) => {
  const userId = event.principalId.split('-')[0];
  UserInfo.getUserInfoById(userId, (error, serializedUser) => {
    if (error) {
      return callback(error);
    }
    return workoutCreator(serializedUser)
      .then(m => WorkoutService.getProgram(m.id))
      .then(m => callback(null, m))
      .catch(Sequelize.EmptyResultError,
        e => Errors.failedDependency(callback, 'Looks like you have no previous results', e))
      .catch(e => Errors.internalError(callback, e));
  });
};
