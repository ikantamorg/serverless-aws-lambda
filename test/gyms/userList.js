const assert = require('chai').assert;
const expect = require('chai').expect;
const bluebird = require('bluebird');
const FactoryGirl = require('../factories/factories').promisify(bluebird);
const _ = require('lodash');
const myLambda = require('../../functions/gyms/userList/handler');

describe('Get checkup results of particular user', () => {
  let adminId;
  let gymId;
  afterEach(done => {
    FactoryGirl.cleanup(done);
  });

  beforeEach(done => {
    FactoryGirl.create('gym').then(gym => {
      gymId = gym.id;
      FactoryGirl.create('institutionUserWithoutInstitutionIdAndGymId',
      { institution_id: gym.institution_id, gym_id: gym.id }).then(institutionUser => {
        FactoryGirl.create('gymsAdminWithoutGymId', { gym_id: institutionUser.gym_id }).then(admin => {
          adminId = admin.id;
          done();
        });
      });
    });
  });

  const expectedKeys = ['id', 'email', 'phone', 'postal_address_line_1', 'postal_address_line_2', 'address_line_1',
    'address_line_2', 'post_address_as_main_address', 'city', 'state', 'country', 'zip_code', 'first_name',
    'last_name', 'gender', 'date_of_birthday', 'emergency_contact_name', 'emergency_contact_phone', 'status',
    'created_at', 'updated_at', 'institutions_user',
  ];

  it('return success if status changed', (done) => {
    const params = { adminIdAndAdminTabletId: `${adminId}-`, gymId };
    myLambda.handler(params, null, (err, data) => {
      try {
        const jsonData = JSON.parse(JSON.stringify(data));
        assert.equal(err, null);
        assert.includeMembers(_.keys(jsonData[0]), expectedKeys);
        done();
      } catch (e) {
        done(new Error(e.message));
      }
    });
  });

  it('return error if cannot find admin', (done) => {
    const params = { adminIdAndAdminTabletId: '0-', gymId };
    myLambda.handler(params, null, (err, data) => {
      try {
        assert.equal(err, '{"status":404,"errors":"Can\'t find admin with id = 0"}');
        assert.equal(data, null);
        done();
      } catch (e) {
        done(new Error(e.message));
      }
    });
  });


  it('return error if admin is not from this gym', (done) => {
    FactoryGirl.create('gymsAdmin').then((admin) => {
      adminId = admin.id;
      const params = { adminIdAndAdminTabletId: `${adminId}-`, gymId };
      myLambda.handler(params, null, (err, data) => {
        try {
          assert.equal(err, '{"status":403,"errors":"Admin is not from this gym"}');
          assert.equal(data, null);
          done();
        } catch (e) {
          done(new Error(e.message));
        }
      });
    });
  });
});
