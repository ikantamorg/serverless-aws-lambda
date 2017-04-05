const UserInfo = require('../../../lib/helpers/user_info');
const Errors = require('../../../lib/shared/errors');

module.exports.handler = (event, context, callback) => {
  const userIdAndMachineId = event.userIdAndMachineId.split('-');
  const userId = userIdAndMachineId[0];
  return UserInfo.getDashboard(userId)
    .then(data => callback(null, data))
    .catch(ReferenceError, TypeError, (e) => Errors.internalError(callback, e));
};
