const expect = require('chai').expect;
const painScore = require('../../../../lib/checkup/score_calculators/pain_assessment');

describe('Pain score: ', function () {

  beforeEach(function () {
    this.pain = {
      wrists_and_hands: 0,
      elbows: 0,
      shoulders: 0,
      shoulder_blades: 0,
    };
  });

  it('Should return 30 if user has no pain', function () {
    expect(painScore(this.pain)).to.equal(30);
  });

  it('Should return 25 if pain level 1 - 2', function () {
    this.pain.wrists_and_hands = 1;
    expect(painScore(this.pain)).to.equal(25);

    this.pain.elbows = 2;
    expect(painScore(this.pain)).to.equal(25);
  });

  it('Should return 20 if pain level 3 - 4', function () {
    this.pain.wrists_and_hands = 3;
    expect(painScore(this.pain)).to.equal(20);

    this.pain.elbows = 4;
    expect(painScore(this.pain)).to.equal(20);
  });

  it('Should return 15 if pain level 5 - 6', function () {
    this.pain.wrists_and_hands = 5;
    expect(painScore(this.pain)).to.equal(15);

    this.pain.elbows = 6;
    expect(painScore(this.pain)).to.equal(15);
  });
});
