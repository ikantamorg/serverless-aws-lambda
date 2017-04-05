const Checkup = require('../../../lib/services/checkup');
const _ = require('lodash');

module.exports.handler = (event, context, callback) => {
  const userIdAndMachineId = event.userIdAndMachineId.split('-');
  const userId = userIdAndMachineId[0];
  if (_.isNaN(new Date(event.date).getTime())) {
    return callback(JSON.stringify({ status: 422, errors: 'Invalid Date' }));
  }
  return Checkup.getComparison(userId, event.date)
    .then(data => callback(null, data),
      (error) => callback(error))
    .catch(e => callback(e));
};
