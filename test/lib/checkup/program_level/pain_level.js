const should = require('chai').should();
const expect = require('chai').expect;
const programByPainLevel = require('../../../../lib/checkup/program_level/pain_level');

describe('Program by pain level: ', () => {

  it('Should return A001 when level 10', () => programByPainLevel(10).should.equal('A001'));
  it('Should return A001 when level 9', () => programByPainLevel(9).should.equal('A001'));
  it('Should return A002 when level 8', () => programByPainLevel(8).should.equal('A002'));
  it('Should return A003 when level 7', () => programByPainLevel(7).should.equal('A003'));
  it('Should return B001 when level 6', () => programByPainLevel(6).should.equal('B001'));
  it('Should return B002 when level 5', () => programByPainLevel(5).should.equal('B002'));
  it('Should return B003 when level 4', () => programByPainLevel(4).should.equal('B003'));
  it('Should return C001 when level 3', () => programByPainLevel(3).should.equal('C001'));
  it('Should return C002 when level 2', () => programByPainLevel(2).should.equal('C002'));
  it('Should return C003 when level 1', () => programByPainLevel(1).should.equal('C003'));
  it('Should return null when level 0', () => expect(programByPainLevel(0)).to.equal(null));
  it('Should return current program when level 0', () => programByPainLevel(0, 'A003').should.equal('A003'));

});
