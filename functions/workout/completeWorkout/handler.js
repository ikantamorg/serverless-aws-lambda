const Workout = require('../../../lib/services/workout');
const moment = require('moment');

module.exports.handler = (event, context, callback) => {
  Workout.completeOutDated(moment().subtract(2, 'h'))
    .then(count => callback(null, `Affected ${count} rows`));
};
