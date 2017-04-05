/**
 * BBE-99 - Code refactoring
 * https://blumcorp.atlassian.net/browse/BBE-12
 */

function BreakSignal(message) {
  this.message = message;
  this.name = 'BreakSignal';
  Error.captureStackTrace(this, BreakSignal);
}

BreakSignal.prototype = Object.create(Error.prototype);
BreakSignal.prototype.constructor = BreakSignal;

module.exports = BreakSignal;
