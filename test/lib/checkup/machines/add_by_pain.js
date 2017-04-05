const expect = require('chai').expect;
const addMachinesByPain = require('../../../../lib/checkup/machines/add_by_pain');

describe('Set of machines by pain zones and level: ', function () {

  beforeEach(function () {
    this.painAssesment = {
      wrists_and_hands: 0,
      elbows: 0,
      shoulders: 0,
      shoulder_blades: 0,
      ankles_and_feet: 0,
      knees: 0,
      hips: 0,
      cervical: 0,
      diaphragm: 0,
      thoracic: 0,
      lumbar: 0,
      pelvis: 0,
    };
  });

  it('Should return empty if user has no pain', function () {
    let machines = addMachinesByPain(this.painAssesment);
    expect(machines).to.be.an('Array');
    expect(machines).to.be.empty;
  });

  describe('Wrists and Hands', function () {

    it('Should return C1, C2 for pain level 1-5', function () {
      this.painAssesment.wrists_and_hands = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2', 'C1']);

      this.painAssesment.wrists_and_hands = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2', 'C1']);
    });

    it('Should return C1 for pain level 6-10', function () {
      this.painAssesment.wrists_and_hands = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C1']);

      this.painAssesment.wrists_and_hands = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C1']);
    });

  });

  describe('Shoulders', function () {

    it('Should return C1 for pain level 1-5', function () {
      this.painAssesment.shoulders = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C1']);

      this.painAssesment.shoulders = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C1']);
    });

    it('Should return C1 for pain level 6-10', function () {
      this.painAssesment.shoulders = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C1']);

      this.painAssesment.shoulders = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C1']);
    });

  });

  describe('Shoulder Blades', function () {

    it('Should return C2 for pain level 1-5', function () {
      this.painAssesment.shoulder_blades = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);

      this.painAssesment.shoulder_blades = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);
    });

    it('Should return C2 for pain level 6-10', function () {
      this.painAssesment.shoulder_blades = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);

      this.painAssesment.shoulder_blades = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);
    });

  });

  describe('Elbows', function () {

    it('Should return C2 for pain level 1-5', function () {
      this.painAssesment.elbows = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);

      this.painAssesment.elbows = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);
    });

    it('Should return C2 for pain level 6-10', function () {
      this.painAssesment.elbows = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);

      this.painAssesment.elbows = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);
    });

  });

  describe('Ankles and Feet', function () {

    it('Should return C2 for pain level 1-5', function () {
      this.painAssesment.elbows = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);

      this.painAssesment.elbows = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);
    });

    it('Should return C2 for pain level 6-10', function () {
      this.painAssesment.elbows = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);

      this.painAssesment.elbows = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['C2']);
    });

  });

  describe('Hips', function () {

    it('Should return B1 for pain level 1-5', function () {
      this.painAssesment.hips = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);

      this.painAssesment.hips = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);
    });

    it('Should return B1 for pain level 6-10', function () {
      this.painAssesment.hips = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);

      this.painAssesment.hips = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);
    });

  });

  describe('Knees', function () {

    it('Should return B1 for pain level 1-5', function () {
      this.painAssesment.hips = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);

      this.painAssesment.hips = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);
    });

    it('Should return B1 for pain level 6-10', function () {
      this.painAssesment.hips = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);

      this.painAssesment.hips = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);
    });

  });

  describe('Cervical', function () {

    it('Should return A1, A2 for pain level 1-5', function () {
      this.painAssesment.cervical = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1', 'A2']);

      this.painAssesment.cervical = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1', 'A2']);
    });

    it('Should return A1 for pain level 6-10', function () {
      this.painAssesment.cervical = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1']);

      this.painAssesment.cervical = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1']);
    });

  });

  describe('Diaphragm', function () {

    it('Should return A1, A2 for pain level 1-5', function () {
      this.painAssesment.diaphragm = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1', 'A2']);

      this.painAssesment.diaphragm = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1', 'A2']);
    });

    it('Should return A1 for pain level 6-10', function () {
      this.painAssesment.diaphragm = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1']);

      this.painAssesment.diaphragm = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1']);
    });

  });

  describe('Lumbar', function () {

    it('Should return A1, A2 for pain level 1-5', function () {
      this.painAssesment.lumbar = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1', 'A2']);

      this.painAssesment.lumbar = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1', 'A2']);
    });

    it('Should return A1 for pain level 6-10', function () {
      this.painAssesment.lumbar = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1']);

      this.painAssesment.lumbar = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['A1']);
    });

  });

  describe('Pelvis', function () {

    it('Should return B1 for pain level 1-5', function () {
      this.painAssesment.pelvis = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);

      this.painAssesment.pelvis = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);
    });

    it('Should return B1 for pain level 6-10', function () {
      this.painAssesment.pelvis = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);

      this.painAssesment.pelvis = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B1']);
    });

  });

  describe('Thoracic', function () {

    it('Should return B3 for pain level 1-5', function () {
      this.painAssesment.thoracic = 1;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B3']);

      this.painAssesment.thoracic = 5;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B3']);
    });

    it('Should return B3 for pain level 6-10', function () {
      this.painAssesment.thoracic = 6;
      let machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B3']);

      this.painAssesment.thoracic = 10;
      machines = addMachinesByPain(this.painAssesment);
      expect(machines).to.be.an('Array');
      expect(machines.map(m => m.type)).to.have.same.members(['B3']);
    });

  });

});
