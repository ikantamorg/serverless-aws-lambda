/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */

const setTargetProgram = require('./misc/set_target_program');
const BodyZones = require('../models/machine_exercise_body_zone').associate();
const WorkoutExercise = require('../models/workout_program_exercise').associate();
const WorkoutExerciseResult = require('../models/workout_exercise_result').associate();
const MachineType = require('../models/machine_type');
const ProgramExercise = require('../models/program_exercise');
const Constants = require('../shared/constants');
const _ = require('lodash');
const Promise = require('bluebird');
const skipFulfilled = require('./misc/skip_fulfilled');
const isFulfilled = require('./misc/is_fulfilled');
const lastCheckupResults = require('./misc/last_checkup_results');
const lastWorkoutResults = require('./misc/last_workout_results');
const addExercises = require('./misc/add_exercises');
const addByExercise = require('./misc/add_by_exercise');

const addByBodyZoneName = (zoneName, restriction, self) => {
  const category = restriction[0];
  return BodyZones.scope({ method: ['byBodyZoneAndCategory', _.startCase(zoneName), category] })
    .findAll()
    .then(data => addExercises(restriction, data, self));
};

const self = {};

const addBasicExercises = exercises => _.each(exercises, machineType => {
  self.circle1.push(_.chain(self.exercises)
    .filter(e => _.isEqual(e.machine_type.name, machineType)).first().value());
});

module.exports = user => {
  self.user = user;
  self.circle1 = [];
  self.circle2 = [];
  self.circle3 = [];
  self.circles = [self.circle1, self.circle2, self.circle3];

  const basic = ['B2', 'B6'];
  const additional = ['B7', 'B5'];

  return setTargetProgram(user).then(program => {
    self.program = program;
    const painAssessment = user.questionnaires.answers.pain_assessment;
    const pains = _.chain(painAssessment).toPairs()
      .sortBy(1).filter(o => o[1] > 0)
      .value();
    /**
     *  Category, Limit, Container
     * @type {*[]}
     */
    self.exerciseRestrictions = [
      [Constants.MACHINE_EXERCISE.CATEGORIES.FIRST, program.cat_1, self.circle1],
      [Constants.MACHINE_EXERCISE.CATEGORIES.SECOND, program.cat_2, self.circle2],
      [Constants.MACHINE_EXERCISE.CATEGORIES.THIRD, program.cat_3, self.circle3],
    ];
    return WorkoutExercise.findAll({
      where: {
        workout_program_id: program.id,
      },
      include: [WorkoutExercise.belongsTo(MachineType)],
    })
      .then(exercises => {
        self.exercises = exercises;
        addBasicExercises(basic);

        const limit = Constants.WORKOUT.ADDITIONAL_EXERCISES.SESSIONS;
        return WorkoutExerciseResult.scope({ method: ['lastResults', user.id, _.first(additional), limit] })
          .findAll().then(data => {
            if (_.chain(data).size().eq(limit).value() &&
              _.chain(data).filter(o => _.gte(o.qom, Constants.WORKOUT.ADDITIONAL_EXERCISES.QOM)).size()
                .gte(Constants.WORKOUT.ADDITIONAL_EXERCISES.MINIMUM)
                .value()) {
              addBasicExercises([_.last(additional)]);
            } else {
              addBasicExercises([_.first(additional)]);
            }
            return Promise.map(self.exerciseRestrictions, restriction => {
              if (!isFulfilled(restriction)) {
                return Promise.each(pains, item => addByBodyZoneName(item[0], restriction, self));
              }
              return false;
            });
          });
      });
  })
    .then(() => {
      const restrictions = skipFulfilled(self.exerciseRestrictions);
      self.lastWorkoutResults = [];
      return _.size(restrictions)
        ? lastWorkoutResults(user.id).then(data => { self.lastWorkoutResults = _.first(data); }, () => {})
        : new Promise(resolve => resolve());
    })
    .then(() => Promise.map(skipFulfilled(self.exerciseRestrictions), restriction =>
      Promise.each(self.lastWorkoutResults, result => {
        if (!isFulfilled(restriction)) {
          return WorkoutExercise.findById(result.workout_exercise.workout_program_exercise_id)
            .then(exercise => addByExercise(exercise.machine_exercise_id, restriction, self));
        }
        return false;
      })
    ))
    .then(() => {
      const restrictions = skipFulfilled(self.exerciseRestrictions);
      self.lastCheckupResults = [];
      return _.size(restrictions)
        ? lastCheckupResults(user.id).then(data => { self.lastCheckupResults = data; })
        : new Promise(resolve => resolve());
    })
    .then(() => Promise.each(skipFulfilled(self.exerciseRestrictions), restriction =>
      Promise.each(self.lastCheckupResults, result => {
        if (!isFulfilled(restriction)) {
          return ProgramExercise.findById(result.checkup_exercise.program_exercise_id)
            .then(exercise => addByExercise(exercise.machine_exercise_id, restriction, self));
        }
        return false;
      })
    ))
    .then(() => self);
};
