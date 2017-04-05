/**
 * BBE-120.Assign service to a customer, track visits
 * https://blumcorp.atlassian.net/browse/BBE-120
 */

const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const Visit = require('../models/visit');
const Constants = require('../shared/constants');

const expiry = service => (!_.isNil(service.expiry) && moment.duration(moment().diff(service.expiry)).asSeconds() > 0);

const expiryVisit = visit => (_.isNil(visit) ||
  moment.duration(moment().diff(visit.created_at)).asHours() > Constants.VISIT.EXPIRY);

const overVisit = (service, visits) => !(_.isNil(service.visits) || service.visits > _.size(visits));

const trackVisit = user => new Promise((resolve, reject) => {
  user.getActiveService()
    .then(service => {
      if (_.isNil(service)) {
        reject();
        return;
      }
      service.getVisits({ order: [['created_at', 'DESC']] })
        .then(visits => {
          const lastVisit = _.first(visits);
          if (!(overVisit(service, visits) && expiryVisit(lastVisit)) && !expiry(service)) {
            if (expiryVisit(lastVisit)) {
              Visit.create({ users_service_id: service.id }, { validate: false })
                .finally(resolve);
            } else {
              resolve(lastVisit);
            }
          } else {
            reject();
          }
        });
    });
});

const checkStatus = user => new Promise(resolve => {
  user.getActiveService()
    .then(service => {
      if (_.isNil(service)) {
        resolve(false);
        return;
      }
      service.getVisits({ order: [['created_at', 'DESC']] })
      .then(visits => {
        const lastVisit = _.first(visits);
        if (expiry(service) || (overVisit(service, visits) && expiryVisit(lastVisit))) {
          resolve(false);
        }
        resolve(true);
      });
    });
});


module.exports = {
  trackVisit,
  checkStatus,
};
