const expect = require('chai').expect;
const inRangeWithEnd = require('../../lib/helpers/in_range_with_end');

describe('In range with end function: ', () => {
  beforeEach(function () {
    this.inRagne = inRangeWithEnd(10);
  });

  it('Should return TRUE for range 10 - 20', function () {
    expect(this.inRagne(10, 20)).to.equal(true);
  });

  it('Should return TRUE for range 5 - 12', function () {
    expect(this.inRagne(5, 12)).to.equal(true);
  });

  it('Should return TRUE for range 5 - 10', function () {
    expect(this.inRagne(5, 10)).to.equal(true);
  });

  it('Should return FALSE for range 11 - 15', function () {
    expect(this.inRagne(11, 15)).to.equal(false);
  });

  it('Should return FALSE for range 2 - 8', function () {
    expect(this.inRagne(2, 8)).to.equal(false);
  });

});
