const UserService = require('../../../lib/services/user');
const checkupCreator = require('../../../lib/checkup/create_and_save_checkup_by_user');
const EventLogger = require('../../../lib/services/event');
const GymsAdmin = require('../../../lib/models/gyms_admin');

module.exports.handler = (event, context, callback) => {
  const adminId = event.adminIdAndAdminTabletId.split('-')[0];
  return GymsAdmin.findById(adminId)
    .then(admin => UserService.createUser(event, (err, user) => {
      if (err) {
        callback(err);
        return;
      }
      checkupCreator(user).then(() => EventLogger.createEvent(admin, { id: user.id, type: 'User' }, 'user'))
        .finally(() => callback(null, user));
    }));
};
