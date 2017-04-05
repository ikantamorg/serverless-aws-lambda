/**
 * BBE-33 - Save training results
 * https://blumcorp.atlassian.net/browse/BBE-33
 */

const _ = require('lodash');
const WorkoutExercise = require('../models/workout_exercise').associate();
const Workout = require('../models/workout').associate();
const WorkoutResult = require('../models/workout_result');
const ExerciseResult = require('../models/workout_exercise_result');
const DisabledVideo = require('../models/disabled_video');
const Constants = require('../shared/constants');
const Promise = require('bluebird');
const exerciseHelper = require('./machine_exercise');
const moment = require('moment');
const db = require('../db/connector');
const average = require('../helpers/average');

const saveWorkoutResult = workout => ExerciseResult.findAll({ where: { workout_id: workout.id } })
  .then(results => {
    const params = {};
    _.map(Constants.WORKOUT.INDICATORS, i => {
      params[i] = average(_.map(results, m => m.getDataValue(i)));
    });
    return WorkoutResult.findOrCreate({ where: { workout_id: workout.id, date: moment().toJSON() }, defaults: params })
      .spread(m => m.update(params))
      .finally(() => workout);
  });

const completeOutDated = time =>
  Workout.scope({ method: ['outdated', time] }, 'exercises').findAll()
    .then(models => Promise.map(models, model => {
      if (!_.size(model.workout_exercise_results)) {
        // const completed = _.chain(model.workout_exercises).filter({ completed: true }).size().value();
        // if (_.gte(completed, Constants.WORKOUT.COMPLETE_ON_SIZE)) {
        return model.close()
          .then(saveWorkoutResult);
        // }
        // return model.destroy();
      }
      return true;
    }))
    .then(affected => _.chain(affected).flatten().size().value());


const completeWorkout = workoutId =>
  Workout.findOne({
    where: {
      id: workoutId,
      status: {
        $ne: Constants.WORKOUT.STATUS.FINISHED,
      },
    },
    include: [{
      model: db.models.workout_exercises,
      required: false,
      where: {
        completed: false,
      },
    }],
  })
    .then(workout => new Promise(resolve => {
      if (_.isNil(workout)) {
        resolve();
        return;
      }
      if (workout.workout_exercises.length) {
        resolve(workout);
        return;
      }
      workout.update({ status: Constants.WORKOUT.STATUS.FINISHED }, { validate: false })
        .then(saveWorkoutResult)
        .then(resolve);
    }));

const saveExerciseResult = (workoutExerciseId, params) => {
  const exerciseParams = params;
  const self = {};
  return WorkoutExercise.findOne({
    where: { id: workoutExerciseId },
    include: [WorkoutExercise.belongsTo(Workout)],
    rejectOnEmpty: true })
    .then(exercise => {
      self.exercise = exercise;
      _.assign(exerciseParams, { workout_id: exercise.workout_id });
      return exercise.getResult({ rejectOnEmpty: true })
        .then(result => result.update(exerciseParams),
          () => self.exercise.setResult(ExerciseResult.build(exerciseParams)))
        .then(result => {
          self.exercise.update({ completed: true }, { validate: false });
          return new Promise(resolve => resolve(result));
        });
    }, e => new Promise((resolve, reject) => reject(e)));
};

const saveExerciseResultRawData = (exerciseId, params) => {
  const exerciseParams = params;
  return WorkoutExercise.findOne({
    where: { id: exerciseId },
    include: [WorkoutExercise.belongsTo(Workout)],
    rejectOnEmpty: true })
    .then(exercise => exercise.getResult()
        .then(result => result.update(exerciseParams), e => new Promise((resolve, reject) => reject(e)))
      , e => new Promise((resolve, reject) => reject(e)));
};

const saveFeedback = (exerciseId, feedback) =>
  WorkoutExercise.findOne({
    where: { id: exerciseId },
    include: [WorkoutExercise.belongsTo(Workout)],
    rejectOnEmpty: true })
    .then(exercise => exercise.getResult({ rejectOnEmpty: true })
        .then(result => result.update({ feedback }), e => new Promise((resolve, reject) => reject(e)))
      , e => new Promise((resolve, reject) => reject(e)));


const updateWorkout = (workoutId, userId, params) =>
  Workout.findOne({ where: { id: workoutId, user_id: userId }, rejectOnEmpty: true })
    .then(resource => resource.update(params));


const calcTime = program => {
  const categories = [program.cat_1, program.cat_2, program.cat_3];
  let totalTime = program.total_time;
  totalTime -= _.chain(categories).map(i => program.tbe * _.max([i - 1, 0])).sum().value();
  totalTime -= _.max([_.chain(categories).filter(i => i > 0).size().value() - 1, 0]) * program.tbc;
  return _.map(categories, (c, index) => {
    if (c > 0) {
      return _.ceil(totalTime * (Constants.WORKOUT.EXERCISES.TIME[index + 1] || 0) / c);
    }
    return 0;
  });
};

const getProgram = workoutId => {
  const workout = {};
  const exercises = [];
  return Workout.scope({ method: ['withExercises', workoutId] }, 'withUser').findOne({ rejectOnEmpty: true })
    .then(data => {
      const self = {};
      _.assign(workout, _.omit(data.toJSON(), ['workout_exercises', 'user']));
      if (_.isNil(workout.workout_program)) {
        return new Promise(resolve => resolve(workout));
      }
      const exerciseTime = calcTime(workout.workout_program);
      let programTime = 0;
      let previousCategory;
      return Promise.each(data.workout_exercises, ce => {
        const exercise = _.omit(ce.toJSON(), ['ProgramExercise']);
        const time = exerciseTime[ce.category - 1];
        _.assign(exercise, { time });
        self.ce = ce;
        self.ex = ce.ProgramExercise;
        programTime += time;
        if (!_.isNil(previousCategory) && !_.isEqual(previousCategory, ce.category)) {
          programTime -= workout.workout_program.tbe;
          programTime += workout.workout_program.tbc;
        }
        if (programTime < workout.total_time) {
          programTime += workout.workout_program.tbe;
          previousCategory = ce.category;
          _.assign(exercise, _.omit(self.ex.toJSON(),
            ['program_id', 'machine_type_id', 'machine_exercise_id', 'machine_type', 'id', 'program_exercise_id']));
          _.assign(exercise, {
            rom: self.ex.machine_type.rom,
            number_of_repetitions: exerciseHelper.getRepetitions(time, exercise.tempo),
          });
          return self.ex.getMachineExercise()
            .then(me => {
              self.me = me;
              _.assign(exercise, _.pick(me, ['name', 'key', 'description', 'video', 'sensor', 'mode']));
              _.assign(exercise, { exercise_id: me.id });
              return DisabledVideo.findOne({ where: { user_id: workout.user_id, machine_exercise_id: me.id } });
            })
            .then(disabled => {
              _.assign(exercise, { show_video: !disabled });
              return exerciseHelper.getNormatives(self.me, data.user.getAge()).then(normatives => {
                _.assign(exercise, { normatives });
                return self.me.getBodyZones();
              });
            })
            .then(bz => {
              self.bz = bz;
              exercise.body_zones = _.map(bz, m => m.name);
              return self.ex.getMachineSettings();
            })
            .then(ms => {
              exercise.settings = _.map(ms, m =>
                ({
                  name: m.name,
                  description: m.description,
                  title: m.title,
                  image: m.image,
                  option: m.machine_settings_workout_program_exercises.value,
                })
              );
              return self.ex.getBodyPositions();
            })
            .then(bp => {
              exercise.body_positions = _.map(bp, m => _.pick(m, ['name', 'description', 'image']));
              return self.me.getFeetPosition();
            })
            .then(fp => {
              if (!fp) {
                exercise.feet_positions = null;
              } else {
                exercise.feet_positions = fp.key;
              }
              return new Promise(resolve => resolve(null));
            })
            .finally(() => {
              exercises.push(exercise);
            });
        }
        return true;
      })
        .then(() => {
          workout.exercises = exercises;
        });
    }, () => new Promise(resolve => resolve(null)))
    .then(() => new Promise(resolve => resolve(workout)));
};
module.exports = {
  saveExerciseResult,
  saveExerciseResultRawData,
  updateWorkout,
  saveFeedback,
  getProgram,
  completeOutDated,
  completeWorkout,
};
