const expect = require('chai').expect;
const addProgramLevelByCombinedScore = require('../../../../lib/checkup/program_level/combined_score');

describe('Program Level by Combined score: ', function () {

  it('Should return NULL if score <= 14', function () {
    expect(addProgramLevelByCombinedScore(5)).to.be.null;
    expect(addProgramLevelByCombinedScore(14)).to.be.null;
  });

  it('Should return A001 if score 15 - 20', function () {
    expect(addProgramLevelByCombinedScore(15)).to.equal('A001');
    expect(addProgramLevelByCombinedScore(20)).to.equal('A001');
  });

  it('Should return A002 if score 21 - 25', function () {
    expect(addProgramLevelByCombinedScore(21)).to.equal('A002');
    expect(addProgramLevelByCombinedScore(25)).to.equal('A002');
  });

  it('Should return A003 if score 26 - 30', function () {
    expect(addProgramLevelByCombinedScore(26)).to.equal('A003');
    expect(addProgramLevelByCombinedScore(30)).to.equal('A003');
  });

  it('Should return B001 if score 31 - 35', function () {
    expect(addProgramLevelByCombinedScore(31)).to.equal('B001');
    expect(addProgramLevelByCombinedScore(35)).to.equal('B001');
  });

  it('Should return B002 if score 36 - 40', function () {
    expect(addProgramLevelByCombinedScore(36)).to.equal('B002');
    expect(addProgramLevelByCombinedScore(40)).to.equal('B002');
  });

  it('Should return B003 if score 41 - 45', function () {
    expect(addProgramLevelByCombinedScore(41)).to.equal('B003');
    expect(addProgramLevelByCombinedScore(45)).to.equal('B003');
  });

  it('Should return C001 if score 46 - 55', function () {
    expect(addProgramLevelByCombinedScore(46)).to.equal('C001');
    expect(addProgramLevelByCombinedScore(55)).to.equal('C001');
  });

  it('Should return C002 if score 56 - 65', function () {
    expect(addProgramLevelByCombinedScore(56)).to.equal('C002');
    expect(addProgramLevelByCombinedScore(65)).to.equal('C002');
  });

  it('Should return C003 if score 66 - 75', function () {
    expect(addProgramLevelByCombinedScore(66)).to.equal('C003');
    expect(addProgramLevelByCombinedScore(75)).to.equal('C003');
  });

  it('Should return D001 if score 76 - 85', function () {
    expect(addProgramLevelByCombinedScore(76)).to.equal('D001');
    expect(addProgramLevelByCombinedScore(85)).to.equal('D001');
  });

  it('Should return D002 if score 86 - 95', function () {
    expect(addProgramLevelByCombinedScore(86)).to.equal('D002');
    expect(addProgramLevelByCombinedScore(95)).to.equal('D002');
  });

  it('Should return D003 if score 96 - 105', function () {
    expect(addProgramLevelByCombinedScore(96)).to.equal('D003');
    expect(addProgramLevelByCombinedScore(105)).to.equal('D003');
  });

  it('Should return E001 if score 106 - 115', function () {
    expect(addProgramLevelByCombinedScore(106)).to.equal('E001');
    expect(addProgramLevelByCombinedScore(115)).to.equal('E001');
  });

  it('Should return E002 if score 116 - 125', function () {
    expect(addProgramLevelByCombinedScore(116)).to.equal('E002');
    expect(addProgramLevelByCombinedScore(125)).to.equal('E002');
  });

  it('Should return E003 if score > 125', function () {
    expect(addProgramLevelByCombinedScore(126)).to.equal('E003');
    expect(addProgramLevelByCombinedScore(130)).to.equal('E003');
    expect(addProgramLevelByCombinedScore(140)).to.equal('E003');
    expect(addProgramLevelByCombinedScore(150)).to.equal('E003');
    expect(addProgramLevelByCombinedScore(160)).to.equal('E003');
  });
});
