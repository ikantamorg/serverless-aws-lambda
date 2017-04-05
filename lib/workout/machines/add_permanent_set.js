/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */

const machinesFactory = require('../../checkup/misc/machines_factory');

const defaultMachines = ['B2', 'B6'];

/**
 * Add default machine set to user
 */
module.exports = () => defaultMachines.map((type) => machinesFactory(type));
