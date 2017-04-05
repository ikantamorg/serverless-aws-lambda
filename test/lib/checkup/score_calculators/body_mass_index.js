const expect = require('chai').expect;
const bmiScore = require('../../../../lib/checkup/score_calculators/body_mass_index');

describe('Body mass index score: ', function () {

  it('Should return 30 if bmi in [21, 22]', function () {
    expect(bmiScore(21)).to.equal(30);
    expect(bmiScore(22)).to.equal(30);
  });

  it('Should return 25 if bmi in [19,20,23,24]', function () {
    expect(bmiScore(19)).to.equal(25);
    expect(bmiScore(20)).to.equal(25);
    expect(bmiScore(23)).to.equal(25);
    expect(bmiScore(24)).to.equal(25);
  });

  it('Should return 10 if bmi in [17,18]', function () {
    expect(bmiScore(17)).to.equal(10);
    expect(bmiScore(18)).to.equal(10);
  });

  it('Should return 10 if bmi in [14,15,16]', function () {
    expect(bmiScore(14)).to.equal(5);
    expect(bmiScore(15)).to.equal(5);
    expect(bmiScore(16)).to.equal(5);
  });

  it('Should return 2 if bmi < 14', function () {
    expect(bmiScore(13)).to.equal(2);
    expect(bmiScore(5)).to.equal(2);
  });

  it('Should return 25 if bmi in [25, 26, 27]', function () {
    expect(bmiScore(25)).to.equal(25);
    expect(bmiScore(26)).to.equal(25);
    expect(bmiScore(27)).to.equal(25);
  });

  it('Should return 20 if bmi in [28,29,30]', function () {
    expect(bmiScore(28)).to.equal(20);
    expect(bmiScore(29)).to.equal(20);
    expect(bmiScore(30)).to.equal(20);
  });

  it('Should return 15 if bmi in [31,32,33]', function () {
    expect(bmiScore(31)).to.equal(15);
    expect(bmiScore(32)).to.equal(15);
    expect(bmiScore(33)).to.equal(15);
  });

  it('Should return 10 if bmi in [34, 35, 36, 37]', function () {
    expect(bmiScore(34)).to.equal(10);
    expect(bmiScore(35)).to.equal(10);
    expect(bmiScore(36)).to.equal(10);
    expect(bmiScore(37)).to.equal(10);
  });

  it('Should return 5 if bmi in [39, 40]', function () {
    expect(bmiScore(39)).to.equal(5);
    expect(bmiScore(40)).to.equal(5);
  });

  it('Should return 2 if bmi >= 41', function () {
    expect(bmiScore(41)).to.equal(2);
    expect(bmiScore(45)).to.equal(2);
    expect(bmiScore(65)).to.equal(2);
  });

});