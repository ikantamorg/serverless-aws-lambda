const expect = require('chai').expect;
const activityLevelCalculator = require('../../../../lib/checkup/score_calculators/activity_level_tpa');

describe('Activity level TPA calculator: ', function () {

  beforeEach(function () {
    this.answers = {
      vigorous_work: {
        vigorous_phisical_activity: 'no',
        vigorous_work_days_per_week: 0,
        vigorous_work_time_per_day: 0,
      },
      moderate_work: {
        moderate_work_intesity_activity: 'no',
        moderate_work_days_per_week: 0,
        moderate_work_time_per_day: 0,
      },
      travel: {
        walk_or_bike_for_more_than_10_min: 'no',
        travel_days_per_week: 0,
        travel_time_per_day: 0,
      },
      vigorous_recreation: {
        vigorous_intensity_sport: 'no',
        vigorous_recreation_days_per_week: 0,
        vigorous_recreation_time_per_day: 0,
      },
      moderate_recreation: {
        moderate_intensity_sport: 'no',
        moderate_recreation_days_per_week: 0,
        moderate_recreation_time_per_day: 0,
      },
    };
  });

  it('Should return 0 if user has no activity', function () {
    expect(activityLevelCalculator(this.answers)).to.equal(0);
  });

  it('Should return the right TPA: (P2 * P3 * 8) + (P5 * P6 * 4) + (P8 * P9 * 4) + (P11 * P12 * 8) + (P14 * P15 * 4)', function () {

    this.answers = {
      vigorous_work: {
        vigorous_phisical_activity: 'yes',
        vigorous_work_days_per_week: 1,
        vigorous_work_time_per_day: 30 * 60,
      },
      moderate_work: {
        moderate_work_intesity_activity: 'yes',
        moderate_work_days_per_week: 2,
        moderate_work_time_per_day: 45 * 60,
      },
      travel: {
        walk_or_bike_for_more_than_10_min: 'yes',
        travel_days_per_week: 3,
        travel_time_per_day: 60 * 60,
      },
      vigorous_recreation: {
        vigorous_intensity_sport: 'yes',
        vigorous_recreation_days_per_week: 4,
        vigorous_recreation_time_per_day: 70 * 60,
      },
      moderate_recreation: {
        moderate_intensity_sport: 'yes',
        moderate_recreation_days_per_week: 5,
        moderate_recreation_time_per_day: 80 * 60,
      },
    };

    const answer = 240 + 360 + 720 + 2240 + 1600;
    expect(activityLevelCalculator(this.answers)).to.equal(answer);

  });

  it('Should return 1440 for vigorous work: (P2 * P3 * 8)', function () {

    this.answers.vigorous_work = {
      vigorous_phisical_activity: 'yes',
      vigorous_work_days_per_week: 3,
      vigorous_work_time_per_day: 60 * 60,
    };

    const answer = 1440; // 3 * 60 * 8  => (P2 * P3 * 8)

    expect(activityLevelCalculator(this.answers)).to.equal(answer);
  });

  it('Should return 960 for moderate work: (P5 * P6 * 4)', function () {

    this.answers.moderate_work = {
      moderate_work_intesity_activity: 'yes',
      moderate_work_days_per_week: 4,
      moderate_work_time_per_day: 60 * 60,
    };

    const answer = 960; // 4 * 60 * 4  => (P5 * P6 * 4)

    expect(activityLevelCalculator(this.answers)).to.equal(answer);
  });

  it('Should return 900 for travel: (P8 * P9 * 4)', function () {

    this.answers.travel = {
      walk_or_bike_for_more_than_10_min: 'yes',
      travel_days_per_week: 5,
      travel_time_per_day: 45 * 60,
    };

    const answer = 900; // 5 * 45 * 4  => (P8 * P9 * 4)

    expect(activityLevelCalculator(this.answers)).to.equal(answer);
  });

  it('Should return 5760 for vigorous recreation: (P11 * P12 * 8)', function () {

    this.answers.vigorous_recreation = {
      vigorous_intensity_sport: 'yes',
      vigorous_recreation_days_per_week: 6,
      vigorous_recreation_time_per_day: 120 * 60,
    };

    const answer = 5760; // 6 * 120 * 4  => (P11 * P12 * 8)

    expect(activityLevelCalculator(this.answers)).to.equal(answer);
  });

  it('Should return 840 for moderate recreation: (P14 * P15 * 4)', function () {

    this.answers.moderate_recreation = {
      moderate_intensity_sport: 'yes',
      moderate_recreation_days_per_week: 7,
      moderate_recreation_time_per_day: 30 * 60,
    };

    const answer = 840; // 7 * 30 * 4  => (P14 * P15 * 4)

    expect(activityLevelCalculator(this.answers)).to.equal(answer);
  });

});
