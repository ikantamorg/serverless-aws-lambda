/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */

const _ = require('lodash');

module.exports = restrictions => _.filter(restrictions, o => _.chain(o[2]).size().lt(o[1]).value());
