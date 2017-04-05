const _ = require('lodash');

module.exports = restriction => {
  const limit = restriction[1];
  const container = restriction[2];
  return _.chain(container).size().isEqual(limit).value();
};
