/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */
const Checkup = require('../../../lib/models/checkups').associate();
const CheckupExerciseResult = require('../../../lib/models/checkup_exercise_result').associate();
const Constants = require('../../shared/constants');

module.exports = userId => Checkup.findOne({
  where: {
    user_id: userId,
    status: Constants.CHECKUP.STATUS_FINISHED,
  },
  order: [['start_date', 'DESC']],
  rejectOnEmpty: true,
})
  .then(checkup => CheckupExerciseResult.scope({ method: ['fromCheckupB4B7', checkup.id] })
    .findAll({ rejectOnEmpty: true }));
