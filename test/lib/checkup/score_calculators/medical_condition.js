const expect = require('chai').expect;
const medicalScore = require('../../../../lib/checkup/score_calculators/medical_condition');

describe('Medical condition score: ', function () {

  beforeEach(function () {
    this.medical = {
      cardio_vascular_conditions: 'none',
      liver_conditions: 'none',
      kidney_conditions: 'none',
      endocrine_system_conditions: 'none',
      oncologic_conditions: 'none',
      operations_in_the_past_3_months: 'none',
    };
  });

  it('Should return 30 if user has no impacts', function () {
    expect(medicalScore(this.medical)).to.equal(30);
  });

  it('Should return 10 if at least one Moderate', function () {
    this.medical.liver_conditions = 'moderately';
    expect(medicalScore(this.medical)).to.equal(10);
  });

  it('Should return 2 if at least one Seriously', function () {
    this.medical.liver_conditions = 'moderately';
    this.medical.cardio_vascular_conditions = 'seriously';
    expect(medicalScore(this.medical)).to.equal(2);
  });

});