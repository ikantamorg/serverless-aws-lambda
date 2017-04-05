/**
 * BBE-76. Integration test: Provide check up program
 * https://blumcorp.atlassian.net/browse/BBE-76
 */

// tests for dashboard

const mod = require('../../functions/users/dashboard/handler');
const mochaPlugin = require('serverless-mocha-plugin');
const Promise = require('bluebird');
const FactoryGirl = require('../factories/factories').promisify(Promise);
const wrapper = mochaPlugin.lambdaWrapper;
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const assert = chai.assert;
const faker = require('faker');
const moment = require('moment');
const _ = require('lodash');

// const liveFunction = {
//   region: process.env.SERVERLESS_REGION,
//   lambdaFunction: process.env.SERVERLESS_PROJECT + '-dueListGet',
// }
describe('Dashboard', () => {
  const scope = {
    checkups: [],
  };
  before(done => {
//  wrapper.init(liveFunction); // Run the deployed lambda
    wrapper.init(mod);
    const dt = moment();
    FactoryGirl.create('institutionUser')
      .then(user => {
        scope.user = user;
        return FactoryGirl.create('checkupWithoutUser', {
          user_id: scope.user.user_id,
          start_date: dt.add(1, 'd'),
        });
      })
      .then(checkup =>{
        scope.checkups.push(checkup);
        return FactoryGirl.create('checkupWithoutUser', {
          user_id: scope.user.user_id,
          start_date: dt.add(1, 'd'),
        });
      })
      .then(checkup => {
        scope.checkups.push(checkup);
        done()
      });
  });

  after(done => {
    FactoryGirl.cleanup(done)
  });

  it('should return no error', done => {
    wrapper.run({
      userIdAndMachineId: `${scope.user.user_id}-1`,
    }, (err, data) => {
      try {
        assert.isNull(err);
        assert.property(data, 'checkup');
        assert.propertyVal(data.checkup, 'id', _.last(scope.checkups).id);
        done();
      } catch (e) {
        done(new Error(e.message));
      }
    });
  });

  it('should return error', done => {
    const requestParams = {
      date: null
    };
    wrapper.run({
      userIdAndMachineId: `100004000-1`,
    }, (err, data) => {
      try {
        assert.isNull(err);
        assert.isObject(data);
        assert.property(data, 'checkup');
        done();
      } catch (e) {
        done(new Error(e.message));
      }
    });
  });
});
