/**
 * BBE-104. Admin dashboard
 * https://blumcorp.atlassian.net/browse/BBE-104
 */

const User = require('../models/user');
const CheckupService = require('../services/checkup');
const Constants = require('../shared/constants');

const getDashboard = admin => {
  const response = {
    clients: [],
    checkup_due_list: [],
  };
  return User.scope({ method: ['fromGym', admin.gym_id] }).findAll()
    .then(users => {
      response.clients = users;
      return CheckupService.getDueListWithCheckup(admin, Constants.DUE_LIST_EXERCISE);
    })
    .then(users => {
      response.checkup_due_list = users;
      return new Promise(resolve => resolve(response));
    });
};
module.exports = {
  getDashboard,
};
