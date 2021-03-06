/**
 * BBE-82. Integration test: Save training results
 * https://blumcorp.atlassian.net/browse/BBE-82
 */

// tests for settings
// Generated by serverless-mocha-plugin

const mod = require('../../functions/workout/saveWorkoutExerciseResult/handler.js');
const mochaPlugin = require('serverless-mocha-plugin');
const Promise = require('bluebird');
const FactoryGirl = require('../factories/factories').promisify(Promise);
const wrapper = mochaPlugin.lambdaWrapper;
const _ = require('lodash');
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const assert = chai.assert;
const faker = require('faker');

// const liveFunction = {
//   region: process.env.SERVERLESS_REGION,
//   lambdaFunction: process.env.SERVERLESS_PROJECT + '-settings',
// }
const scope = {};
describe('Workout exercise result', () => {
  
  before(done => {
//  wrapper.init(liveFunction); // Run the deployed lambda
    wrapper.init(mod);
    FactoryGirl.create('user')
      .then(user => {
        scope.user = user;
        return FactoryGirl.create('workoutWithoutUser', { user_id: user.id });
      })
      .then(workout => FactoryGirl.create('workoutExercise', { workout_id: workout.id}))
      .then(resource => {
        scope.resource = resource;
        done()
      });
  });

  after(done => {
    FactoryGirl.cleanup(done);
  });

  it('should return validation error', done => {
    const requestParams = {
      date: null,
      qom: 123.0,
      range: faker.lorem.word(),
      balance: faker.lorem.word(),
      strength: faker.lorem.word(),
      symmetry: faker.lorem.word(),
      movement: faker.lorem.word(),
      time: faker.lorem.word(),
    };
    wrapper.run({
      requestParams,
      exercise_id: scope.resource.id,
    }, (err) => {
      try {
        err = JSON.parse(err);
        assert.isNotNull(err);
        assert.property(err, 'errors');
        assert.propertyVal(err, 'status', 422);
        assert.sameMembers(_.keys(err.errors), _.keys(requestParams));
        done();
      } catch (e) {
        done(new Error(e.message));
      }
    });
  });

  it('should return not found error', done => {
    const requestParams = {
      feedback: 5
    };
    wrapper.run({
      requestParams,
      exercise_id: scope.resource.id + 100,
    }, (err) => {
      try {
        err = JSON.parse(err);
        assert.isNotNull(err);
        assert.property(err, 'errors');
        assert.propertyVal(err, 'status', 404);
        done();
      } catch (e) {
        done(new Error(e.message));
      }
    });
  });
  
  it('should change model fields', done => {
    const requestParams = {
      qom: 80.11,
      range: 90.89,
      balance: 10.12,
      strength: 10.22,
      symmetry: 1,
      date: new Date(),
      time: faker.random.number(1000),
    };
    wrapper.run({
      requestParams,
      exercise_id: scope.resource.id,
    }, (err, data) => {
      try {
        assert.isNull(err);
        assert.isObject(data);
        assert.containSubset(data, requestParams);
        done();
      } catch (e) {
        done(new Error(e.message));
      }
    });
  });
});
