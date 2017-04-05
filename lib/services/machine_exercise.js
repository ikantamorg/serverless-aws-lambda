const Promise = require('bluebird');
const _ = require('lodash');

const getAgeParam = (normative, age) => {
  const param = {
    min: null,
    max: null,
  };
  if (normative) {
    const data = _.chain(normative.data).toPairs().reverse().value();
    _.each(data, value => {
      if (age > value[0]) {
        _.assign(param, { min: parseFloat(_.get(value, [1, 'min'])) });
        _.assign(param, { max: parseFloat(_.get(value, [1, 'max'])) });
        return false;
      }
      return true;
    });
  }
  return param;
};

const getNormatives = (exercise, userAge) => {
  const normatives = {};
  return Promise.all([
    exercise.getNormativeRom()
      .then(param => _.assign(normatives, { rom: getAgeParam(param, userAge) })),
    exercise.getNormativeStrength()
      .then(param => _.assign(normatives, { strength: getAgeParam(param, userAge) })),
  ]).then(() => normatives);
};

const getRepetitions = (time, tempo) => {
  if (_.gt(tempo, 0)) {
    return _.chain(time).divide(tempo).round().value();
  }
  return 0;
};

module.exports = {
  getNormatives,
  getRepetitions,
};
