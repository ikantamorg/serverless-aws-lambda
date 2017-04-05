
const workoutCreator = require('./workout_creator');
const db = require('../db/connector');
const Workout = require('../../lib/models/workout').associate();
const WorkoutExercise = require('../../lib/models/workout_exercise').associate();
const _ = require('lodash');

module.exports = serializedUser => workoutCreator(serializedUser)
    .then(workoutProgram => new Promise((resolve, reject) => {
      db.transaction((t) => {
        // chain all your queries here. make sure you return them.
        const workoutData = {
          user_id: serializedUser.id,
          workout_program_id: workoutProgram.program.id,
          program_level: workoutProgram.program.program_level.name,
          total_time: workoutProgram.program.total_time,
          date: new Date(),
          workout_exercises: [],
        };
        // const exerises = _.chain(workoutProgram.circles).flatten().value();
        _.each(workoutProgram.exerciseRestrictions, container => {
          _.each(container[2], m => {
            workoutData.workout_exercises.push({
              workout_program_exercise_id: m.id,
              machine_type: m.machine_type.name,
              category: container[0],
            });
          });
        });
        return Workout.create(workoutData, {
          transaction: t,
          include: [WorkoutExercise],
        });
      }).then(resolve)
        .catch(reject);
    }));
