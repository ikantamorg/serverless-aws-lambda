const expect = require('chai').expect;
const ageScore = require('../../../../lib/checkup/score_calculators/age_gender');

describe('Age & Gender score score: ', function () {

  describe('Female score:', function () {
    it('Should return 0 if age < 10', function () {
      expect(ageScore(0, 0)).to.equal(0);
    });

    it('Should return 5 if age 10 - 12', function () {
      expect(ageScore(10, 0)).to.equal(5);
      expect(ageScore(12, 0)).to.equal(5);
    });

    it('Should return 15 if age 13 - 15', function () {
      expect(ageScore(13, 0)).to.equal(15);
      expect(ageScore(15, 0)).to.equal(15);
    });

    it('Should return 20 if age 16 - 18', function () {
      expect(ageScore(16, 0)).to.equal(20);
      expect(ageScore(18, 0)).to.equal(20);
    });

    it('Should return 20 if age 19 - 22', function () {
      expect(ageScore(19, 0)).to.equal(20);
      expect(ageScore(22, 0)).to.equal(20);
    });

    it('Should return 25 if age 23 - 25', function () {
      expect(ageScore(23, 0)).to.equal(25);
      expect(ageScore(25, 0)).to.equal(25);
    });

    it('Should return 30 if age 26 - 34', function () {
      expect(ageScore(26, 0)).to.equal(30);
      expect(ageScore(34, 0)).to.equal(30);
    });

    it('Should return 25 if age 35 - 40', function () {
      expect(ageScore(35, 0)).to.equal(25);
      expect(ageScore(40, 0)).to.equal(25);
    });

    it('Should return 20 if age 41 - 45', function () {
      expect(ageScore(41, 0)).to.equal(20);
      expect(ageScore(45, 0)).to.equal(20);
    });

    it('Should return 20 if age 46 - 50', function () {
      expect(ageScore(46, 0)).to.equal(20);
      expect(ageScore(50, 0)).to.equal(20);
    });

    it('Should return 15 if age 51 - 55', function () {
      expect(ageScore(51, 0)).to.equal(15);
      expect(ageScore(55, 0)).to.equal(15);
    });

    it('Should return 10 if age 56 - 60', function () {
      expect(ageScore(56, 0)).to.equal(10);
      expect(ageScore(60, 0)).to.equal(10);
    });

    it('Should return 5 if age 61 - 70', function () {
      expect(ageScore(61, 0)).to.equal(5);
      expect(ageScore(70, 0)).to.equal(5);
    });

    it('Should return 2 if age 71 - 80', function () {
      expect(ageScore(71, 0)).to.equal(2);
      expect(ageScore(80, 0)).to.equal(2);
    });

    it('Should return 0 if age >= 81', function () {
      expect(ageScore(81, 0)).to.equal(0);
      expect(ageScore(90, 0)).to.equal(0);
      expect(ageScore(105, 0)).to.equal(0);
    });

  });

  describe('Male score:', function () {
    it('Should return 0 if age < 10', function () {
      expect(ageScore(0, 1)).to.equal(0);
    });

    it('Should return 5 if age 10 - 12', function () {
      expect(ageScore(10, 1)).to.equal(5);
      expect(ageScore(12, 1)).to.equal(5);
    });

    it('Should return 10 if age 13 - 15', function () {
      expect(ageScore(13, 1)).to.equal(10);
      expect(ageScore(15, 1)).to.equal(10);
    });

    it('Should return 15 if age 16 - 18', function () {
      expect(ageScore(16, 1)).to.equal(15);
      expect(ageScore(18, 1)).to.equal(15);
    });

    it('Should return 20 if age 19 - 22', function () {
      expect(ageScore(19, 1)).to.equal(20);
      expect(ageScore(22, 1)).to.equal(20);
    });

    it('Should return 25 if age 23 - 25', function () {
      expect(ageScore(23, 1)).to.equal(25);
      expect(ageScore(25, 1)).to.equal(25);
    });

    it('Should return 30 if age 26 - 34', function () {
      expect(ageScore(26, 1)).to.equal(30);
      expect(ageScore(34, 1)).to.equal(30);
    });

    it('Should return 30 if age 35 - 40', function () {
      expect(ageScore(35, 1)).to.equal(30);
      expect(ageScore(40, 1)).to.equal(30);
    });

    it('Should return 25 if age 41 - 45', function () {
      expect(ageScore(41, 1)).to.equal(25);
      expect(ageScore(45, 1)).to.equal(25);
    });

    it('Should return 20 if age 46 - 50', function () {
      expect(ageScore(46, 1)).to.equal(20);
      expect(ageScore(50, 1)).to.equal(20);
    });

    it('Should return 15 if age 51 - 55', function () {
      expect(ageScore(51, 1)).to.equal(15);
      expect(ageScore(55, 1)).to.equal(15);
    });

    it('Should return 10 if age 56 - 60', function () {
      expect(ageScore(56, 1)).to.equal(10);
      expect(ageScore(60, 1)).to.equal(10);
    });

    it('Should return 5 if age 61 - 70', function () {
      expect(ageScore(61, 1)).to.equal(5);
      expect(ageScore(70, 1)).to.equal(5);
    });

    it('Should return 2 if age 71 - 80', function () {
      expect(ageScore(71, 1)).to.equal(2);
      expect(ageScore(80, 1)).to.equal(2);
    });

    it('Should return 0 if age >= 81', function () {
      expect(ageScore(81, 1)).to.equal(0);
      expect(ageScore(90, 1)).to.equal(0);
      expect(ageScore(105, 1)).to.equal(0);
    });

  });

});
