const expect = require('chai').expect;
const addMachineByGender = require('../../../../lib/checkup/machines/add_by_gender');

describe('Set of machines by gender: ', () => {

  it('Should add C1 and C2 for male', () => {

    const machines = addMachineByGender(1);
    expect(machines).to.be.an('Array');
    expect(machines.map(m => m.type)).to.have.same.members(['C2', 'C1']);
  });

  it('Should not add any machines for female', () => {

    const machines = addMachineByGender(0);
    expect(machines).to.be.an('Array');
    expect(machines.map(m => m.type)).to.be.empty;
  });
});
