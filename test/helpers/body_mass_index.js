const expect = require('chai').expect;
const bmiCalc = require('../../lib/helpers/body_mass_index');

describe('Body mass index calculator: ', () => {
  it('Should return 20.8 for weight: 60kg and height: 170cm', function () {
    expect(bmiCalc(60, 170)).to.equal(20.8);
  });

  it('Should return 21.6 for weight: 70kg and height: 180cm', function () {
    expect(bmiCalc(70, 180)).to.equal(21.6);
  });

  it('Should return 20.8 for weight: 85kg and height: 195cm', function () {
    expect(bmiCalc(85, 195)).to.equal(22.4);
  });
});
