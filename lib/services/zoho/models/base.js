/**
 * BBE-41.Zoho integration
 * https://blumcorp.atlassian.net/browse/BBE-41
 */

const _ = require('lodash');

class Base {

  constructor(data) {
    this.attributes = this.constructor.cast(data);
  }

  toJSON() {
    return this.attributes;
  }

  static mappings() {
    return {};
  }

  static array(string) {
    let match;
    if (_.isString(string)) {
      match = string.match(/\[(.*)]/)[1];
    }
    return match ? _.chain(match).split(',').map(m => m.trim()).value() : [];
  }

  static cast(params) {
    return _.mapValues(this.mappings(), (func) => func(params));
  }
}

module.exports = Base;
