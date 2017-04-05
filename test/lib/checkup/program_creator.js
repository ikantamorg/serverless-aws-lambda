const expect = require('chai').expect;
const checkupCreator = require('../../../lib/checkup/program_creator');
const _ = require('lodash');

function createUser(newData) {
  const userData = {
    body_measurements: {
      height: 0,
      weight: 0,
      chest: 0,
      arm: 0,
      waist: 0,
      hips: 0,
      thigh: 0,
      created_at: new Date(),
    },
    questionnaires: {
      answers: {
        vigorous_work: {
          vigorous_phisical_activity: 'no',
        },
        moderate_work: {
          moderate_work_intesity_activity: 'no'
        },
        travel: {
          walk_or_bike_for_more_than_10_min: 'no'
        },
        vigorous_recreation: {
          vigorous_intensity_sport: 'no'
        },
        moderate_recreation: {
          moderate_intensity_sport: 'no'
        },
        medical: {
          cardio_vascular_conditions: 'none',
          liver_conditions: 'none',
          kidney_conditions: 'none',
          endocrine_system_conditions: 'none',
          oncologic_conditions: 'none',
          operations_in_the_past_3_months: 'none',
        },
        pain_assessment: {
          wrists_and_hands: 0,
          elbows: 0,
          shoulders: 0,
          shoulder_blades: 0,
          ankles_and_feet: 0,
          knees: 0,
          hips: 0,
          cervical: 0,
          diaphragm: 0,
          thoracic: 0,
          lumbar: 0,
          pelvis: 0,
        },
        sedentiary: {
          sedentiary_sitting_or_reclining_per_day: 5
        },
      },

      version: 4,
      date: new Date(),
    },
    settings: {
      language: 'ru',
      unit_of_length: 'm/cm',
      unit_of_weight: 'kg',
    },
    email: 'mail@test.com',
    phone: '+3752985928323',
    postal_address_line_1: 'PostalAddress1',
    postal_address_line_2: 'PostalAddress2',
    address_line_1: 'PostalAddress1',
    address_line_2: 'PostalAddress2',
    post_address_as_main_address: true,
    city: 'MyCity',
    state: 'MyState',
    country: 'MyCountry',
    zip_code: 'MyZipCode',
    first_name: 'FName',
    last_name: 'LName',
    gender: 1,
    date_of_birthday: new Date(),
    emergency_contact_name: 'EmergencyContactName',
    emergency_contact_phone: 'EmergencyContactPhone',
    status: 0,
    created_at: new Date(),
    user_tag: '162345',
  };

  const returnObj = _.cloneDeep(userData);
  _.merge(returnObj, newData);

  return returnObj;
}

function getMachinesTypes(collection) {
  return collection.map(m => m.type);
}

describe('Checkup creator: ', function () {

  describe('Checkup for user John Doe (Case 1): ', function () {

    before(function () {
      const user = createUser({
        first_name: 'John',
        last_name: 'Doe',
        gender: 1,
        date_of_birthday: new Date(new Date().getFullYear() - 41, 4, 15, 0, 0, 0),
        body_measurements: {
          height: 182,
          weight: 92,
        },
        questionnaires: {
          answers: {
            moderate_work: {
              moderate_work_intesity_activity: 'yes',
              moderate_work_days_per_week: 5,
              moderate_work_time_per_day: 120 * 60,
            },
            travel: {
              walk_or_bike_for_more_than_10_min: 'yes',
              travel_days_per_week: 5,
              travel_time_per_day: 12 * 60,
            },
            vigorous_recreation: {
              vigorous_intensity_sport: 'yes',
              vigorous_recreation_days_per_week: 1,
              vigorous_recreation_time_per_day: 90 * 60
            },
            medical: {
              operations_in_the_past_3_months: 'moderately',
            },
          },
        },
      });

      this.program = checkupCreator(user);
    });

    it('Age score should be 25', function () {
      expect(this.program.score.age).to.equal(25);
    });

    it('MBI score should be 20', function () {
      expect(this.program.score.mbi).to.equal(20);
    });

    it('Medical condition score should be 10', function () {
      expect(this.program.score.medicalCondition).to.equal(10);
    });

    it('Activity level score should be 30', function () {
      expect(this.program.score.activityLevel).to.equal(30);
    });

    it('Pain score should be 30', function () {
      expect(this.program.score.painAssessment).to.equal(30);
    });

    it('Combined score should be 115', function () {
      expect(this.program.score.combined).to.equal(115);
    });

    it('Score based should be E001', function () {
      expect(this.program.programs.scoreBased).to.equal('E001');
    });

    it('Pain based should be E001', function () {
      expect(this.program.programs.painBased).to.equal('E001');
    });

    it('Machines set should be [B2, B4, B6, B7, D1, C1, C2]', function () {
      expect(getMachinesTypes(this.program.machines)).to.have.same.members([
        'B2', 'B4', 'B6', 'B7', 'D1', 'C1', 'C2',
      ]);
    });

  });

  describe('Checkup for user Mary Black (Case 2): ', function () {

    before(function () {
      const user = createUser({
        first_name: 'Mary',
        last_name: 'Black',
        gender: 0,
        date_of_birthday: new Date(new Date().getFullYear() - 28, 2, 1, 0, 0, 0),
        body_measurements: {
          height: 158,
          weight: 50,
        },
        questionnaires: {
          answers: {
            pain_assessment: {
              shoulder_blades: 5,
            },
            travel: {
              walk_or_bike_for_more_than_10_min: 'yes',
              travel_days_per_week: 5,
              travel_time_per_day: 30 * 60,
            },
          },
        },
      });

      this.program = checkupCreator(user);
    });

    it('Age score should be 30', function () {
      expect(this.program.score.age).to.equal(30);
    });

    it('MBI score should be 25', function () {
      expect(this.program.score.mbi).to.equal(25);
    });

    it('Medical condition score should be 30', function () {
      expect(this.program.score.medicalCondition).to.equal(30);
    });

    it('Activity level score should be 20', function () {
      expect(this.program.score.activityLevel).to.equal(20);
    });

    it('Pain score should be 15', function () {
      expect(this.program.score.painAssessment).to.equal(15);
    });

    it('Combined score should be 125', function () {
      expect(this.program.score.combined).to.equal(120);
    });

    it('Score based should be E002', function () {
      expect(this.program.programs.scoreBased).to.equal('E002');
    });

    it('Pain based should be B002', function () {
      expect(this.program.programs.painBased).to.equal('B002');
    });

    it('Machines set should be [B2, B4, B6, B7, D1, C2]', function () {
      expect(getMachinesTypes(this.program.machines)).to.have.same.members([
        'B2', 'B4', 'B6', 'B7', 'D1', 'C2',
      ]);
    });

  });

  describe('Checkup for user Mark Draper (Case 3): ', function () {

    before(function () {
      const user = createUser({
        first_name: 'Mark',
        last_name: 'Draper',
        gender: 1,
        date_of_birthday: new Date(new Date().getFullYear() - 80, 1, 12, 0, 0, 0),
        body_measurements: {
          height: 172,
          weight: 88,
        },
        questionnaires: {
          answers: {
            pain_assessment: {
              knees: 7,
            },
            moderate_recreation: {
              moderate_intensity_sport: 'yes',
              moderate_recreation_days_per_week: 3,
              moderate_recreation_time_per_day: 30 * 60,
            },
            medical: {
              operations_in_the_past_3_months: 'seriously',
            },
          },
        },
      });

      this.program = checkupCreator(user);
    });

    it('Age score should be 2', function () {
      expect(this.program.score.age).to.equal(2);
    });

    it('MBI score should be 20', function () {
      expect(this.program.score.mbi).to.equal(20);
    });

    it('Pain score should be 10', function () {
      expect(this.program.score.painAssessment).to.equal(10);
    });

    it('Activity level score should be 15', function () {
      expect(this.program.score.activityLevel).to.equal(15);
    });

    it('Medical condition score should be 2', function () {
      expect(this.program.score.medicalCondition).to.equal(2);
    });

    it('Combined score should be 49', function () {
      expect(this.program.score.combined).to.equal(49);
    });

    it('Score based should be E001', function () {
      expect(this.program.programs.scoreBased).to.equal('C001');
    });

    it('Pain based should be E001', function () {
      expect(this.program.programs.painBased).to.equal('A003');
    });

    it('Machines set should be [B2, B4, B6, B7, D1, C1, C2, B1]', function () {
      expect(getMachinesTypes(this.program.machines)).to.have.same.members([
        'B2', 'B4', 'B6', 'B7', 'D1', 'C1', 'C2', 'B1',
      ]);
    });

  });

});
