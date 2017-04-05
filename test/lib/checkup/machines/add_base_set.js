const expect = require('chai').expect;
const addBaseMachineSet = require('../../../../lib/checkup/machines/add_base_set');

describe('Base set of machines: ', () => {

  it('Should be pre-defined', () => {
    const machines = addBaseMachineSet();
    expect(machines).to.be.an('Array');
    expect(machines.map(m => m.type)).to.have.same.members(['B2', 'B4', 'B6', 'B7', 'D1']);
  });

});
