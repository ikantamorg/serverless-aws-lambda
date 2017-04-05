const _ = require('lodash');
/**
 * Average
 * @param array
 * @returns {number}
 */
module.exports = array => {
  const sum = _.sum(array);
  const size = _.size(array);
  return _.gt(size, 0) ? sum / size : 0;
};
