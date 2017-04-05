const expect = require('chai').expect;
const activityLevelScore = require('../../../../lib/checkup/score_calculators/activity_level_score');

describe('Activity level score: ', function () {

  it('Should return 2 if score <= 100', function () {
    expect(activityLevelScore(100)).to.equal(2);
    expect(activityLevelScore(60)).to.equal(2);
  });

  it('Should return 5 if score 101 - 200', function () {
    expect(activityLevelScore(101)).to.equal(5);
    expect(activityLevelScore(200)).to.equal(5);
  });

  it('Should return 10 if score 201 - 300', function () {
    expect(activityLevelScore(201)).to.equal(10);
    expect(activityLevelScore(300)).to.equal(10);
  });

  it('Should return 15 if score 301 - 400', function () {
    expect(activityLevelScore(301)).to.equal(15);
    expect(activityLevelScore(400)).to.equal(15);
  });

  it('Should return 20 if score 401 - 600', function () {
    expect(activityLevelScore(401)).to.equal(20);
    expect(activityLevelScore(600)).to.equal(20);
  });

  it('Should return 25 if score 601 - 700', function () {
    expect(activityLevelScore(601)).to.equal(25);
    expect(activityLevelScore(700)).to.equal(25);
  });

  it('Should return 20 if score > 700', function () {
    expect(activityLevelScore(701)).to.equal(30);
    expect(activityLevelScore(1700)).to.equal(30);
  });

});
