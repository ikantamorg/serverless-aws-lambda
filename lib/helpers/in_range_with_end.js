/**
 * Check if value belongs to range
 * Unlike _.inRange in include 'max' value to range
 *
 * @param val
 */
module.exports = (val) => (min, max) => val >= min && val <= max;
