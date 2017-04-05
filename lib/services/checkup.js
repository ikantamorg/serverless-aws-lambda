/**
 * BBE-38 - Provide checkups comparison
 * https://blumcorp.atlassian.net/browse/BBE-38
 */

const CheckupResult = require('../models/checkup_result').associate();
const User = require('../models/user');
const Workout = require('../models/workout').associate();
const WorkoutExerciseResult = require('../models/workout_exercise_result').associate();
const Checkup = require('../models/checkups').associate();
const CheckupExercise = require('../models/checkup_exercise').associate();
const ExerciseResult = require('../models/checkup_exercise_result').associate();
const moment = require('moment');
const _ = require('lodash');
const Sequelize = require('../db/connector');
const Constants = require('../../lib/shared/constants');
const Promise = require('bluebird');
const average = require('../helpers/average');

const getComparison = (userId, date) => {
  const result = {
    total_time: null,
    sessions: null,
    tests_completed: null,
    last: null,
    first: null,
  };
  return CheckupResult.scope({ method: ['last', userId] }).findOne({ where: { date: { $lte: date } } })
    .then(last => {
      result.last = last;
      return CheckupResult.scope({ method: ['first', userId] }).findOne();
    })
    .then(first => {
      result.first = first;
      return Checkup.count({ where: { status: Constants.CHECKUP.STATUS_FINISHED, user_id: userId } });
    })
    .then(count => {
      result.tests_completed = count;
      return WorkoutExerciseResult.sum('time', {
        include: [{
          model: Workout,
          attributes: [],
          where: {
            user_id: userId,
            status: Constants.WORKOUT.STATUS.FINISHED,
          },
        }],
        group: [[Workout, 'user_id']],
      });
    })
    .then(time => {
      result.total_time = time || 0;
      return Workout.count({ where: { status: Constants.WORKOUT.STATUS.FINISHED, user_id: userId } });
    })
    .then(count => {
      result.sessions = count;
      return result;
    });
};

const getDueList = (admin, every) =>
 User.findAll({
   where: {
     id: {
       $in: Sequelize.literal(`(SELECT user_id FROM 
          (SELECT w.user_id, COUNT(w.id) cnt FROM workouts w
           INNER JOIN workout_exercise_results we ON we.workout_id = w.id
           INNER JOIN (SELECT DISTINCT ON(c.user_id) c.user_id, c.created_at, c.id 
              FROM checkups c
              INNER JOIN institutions_users u ON c.user_id = u.user_id
              WHERE u.gym_id = ${admin.gym_id}
            ORDER BY c.user_id, c.created_at DESC, c.id) 
           lc ON lc.user_id = w.user_id
           WHERE w.date > lc.created_at 
          GROUP BY w.user_id ) sub1 
        WHERE cnt >= ${every})`),
     },
   },
 });

const getNextTime = userId => {
  const scope = {};
  let nextDate = moment().add(Constants.DUE_LIST_EXERCISE + 1, 'days');
  return Checkup.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']], limit: 2, rejectOnEmpty: true })
    .then(data => {
      scope.checkups = data;
      const condition = {};
      if (data.length === 2) {
        condition.$between = [_.last(scope.checkups).start_date, _.first(scope.checkups).start_date];
      } else {
        condition.$gt = _.first(scope.checkups).start_date;
      }
      return Workout.findAll({
        where: { date: condition, user_id: userId },
        order: [['date', 'DESC']],
        rejectOnEmpty: true });
    })
    .then(data => {
      scope.previousWorkouts = data;
      const dt = _.isObject(_.first(scope.previousWorkouts)) ? _.first(scope.previousWorkouts).date : moment();
      return Workout.findAll({ where: {
        date: {
          $gt: dt,
        },
        user_id: userId,
      },
        order: [['date', 'ASC']],
      });
    }, () => new Promise(resolve => resolve(nextDate)))
    .then(data => {
      if (_.size(scope.previousWorkouts) > 0) {
        const date = moment(_.last(scope.previousWorkouts).date);
        const avg = moment.duration(date.diff(_.first(scope.previousWorkouts).date)).asDays() /
          _.max([_.size(scope.previousWorkouts) - 1, 1]);
        const lastExercise = _.last(data) || {};
        nextDate = moment(lastExercise.date || _.first(scope.checkups).start_date);
        nextDate.add((Constants.DUE_LIST_EXERCISE - _.size(data) + 1) * Math.abs(avg), 'd');
      }
      return new Promise(resolve => resolve(nextDate));
    }, () => new Promise(resolve => resolve(nextDate)))
    .catch(e => {
      throw e;
    });
};

const updateCheckup = (checkupId, userId, params) =>
  Checkup.findOne({ where: { id: checkupId, user_id: userId }, rejectOnEmpty: true })
    .then(checkup => checkup.update(params), e => new Promise((resolve, reject) => reject(e)));

const saveExerciseResult = (checkupExerciseId, params) => {
  const exerciseParams = params;
  const self = {};
  return CheckupExercise.findOne({
    where: { id: checkupExerciseId },
    include: [Checkup],
    rejectOnEmpty: true })
    .then(exercise => {
      self.exercise = exercise;
      _.assign(exerciseParams, { checkup_id: exercise.checkup_id });
      return exercise.getResult({ rejectOnEmpty: true })
        .then(result => result.update(exerciseParams),
          () => self.exercise.setResult(ExerciseResult.build(exerciseParams)))
        .then(result => {
          self.exercise.update({ completed: true }, { validate: false });
          return new Promise(resolve => resolve(result));
        });
    }, e => new Promise((resolve, reject) => reject(e)));
};

const saveExerciseResultRawData = (checkupExerciseId, params) => {
  const exerciseParams = params;
  return CheckupExercise.findOne({
    where: { id: checkupExerciseId },
    include: [Checkup],
    rejectOnEmpty: true })
    .then(exercise => exercise.getResult()
        .then(result => result.update(exerciseParams), e => new Promise((resolve, reject) => reject(e)))
    , e => new Promise((resolve, reject) => reject(e)));
};

const saveGeneralCheckupResult = checkup => ExerciseResult.findAll({ where: { checkup_id: checkup.id } })
  .then(results => {
    const params = {};
    _.map(Constants.WORKOUT.INDICATORS, i => {
      params[i] = average(_.map(results, m => m.getDataValue(i)));
    });
    return CheckupResult.findOrCreate({ where: { checkup_id: checkup.id, date: moment().toJSON() }, defaults: params })
      .then(m => _.first(m).update(params))
      .finally(() => checkup);
  });

const completeCheckup = checkupId =>
  Checkup.findOne({
    where: {
      id: checkupId,
      status: {
        $ne: Constants.CHECKUP.STATUS_FINISHED,
      },
    },
    include: [{
      model: Sequelize.models.checkup_exercises,
      required: false,
      where: {
        completed: false,
      },
    }],
  })
    .then(checkup => new Promise(resolve => {
      if (_.isNil(checkup)) {
        resolve();
        return;
      }
      if (checkup.checkup_exercises.length) {
        resolve(checkup);
        return;
      }
      checkup.update({ status: Constants.CHECKUP.STATUS_FINISHED }, { validate: false })
        .then(saveGeneralCheckupResult)
        .then(resolve);
    }));

const completeOutDated = time =>
  Checkup.scope({ method: ['outdated', time] }, 'withExercises').findAll()
    .then(checkups => Promise.map(checkups, model => {
      if (!_.size(model.checkup_exercise_results)) {
        // const completed = _.chain(model.checkup_results).filter({ completed: true }).size().value();
        // if (_.isEqual(completed, _.size(model.checkup_exercises))) {
        return model.close()
          .then(saveGeneralCheckupResult);
        // }
        // return model.destroy();
      }
      return true;
    }))
    .then(affected => _.chain(affected).flatten().size().value());


const getDueListWithCheckup = (admin, every) =>
  Sequelize.query(
    `SELECT checkup_result.user_id, checkup_result.checkup_id, checkup_result.program_level,
              users.first_name || ' ' || users.last_name AS user_name
        FROM users
        INNER JOIN
        (SELECT user_id, checkup_id, program_level FROM
            (SELECT w.user_id, COUNT(w.id) cnt, lc.checkup_id, lc.program_level FROM workouts w
             INNER JOIN workout_exercise_results we ON we.workout_id = w.id
             INNER JOIN (SELECT DISTINCT ON(c.user_id) c.user_id, c.created_at, c.id checkup_id, c.program_level
                FROM checkups c
                INNER JOIN institutions_users u ON c.user_id = u.user_id
                WHERE u.gym_id = ${admin.gym_id}
              ORDER BY c.user_id, c.created_at DESC, c.id)
             lc ON lc.user_id = w.user_id
             WHERE w.date > lc.created_at
            GROUP BY w.user_id, lc.checkup_id, lc.program_level) sub1
          WHERE cnt >= ${every}) checkup_result
          ON users.id = checkup_result.user_id`,
    { type: Sequelize.QueryTypes.SELECT },
  );

const getUserTotalResults = userId => {
  const result = {
    total_time: null,
    sessions: null,
    tests_completed: null,
  };
  return Checkup.count({ where: { status: Constants.CHECKUP.STATUS_FINISHED, user_id: userId } }).then(count => {
    result.tests_completed = count;
    return WorkoutExerciseResult.sum('time', {
      include: [{
        model: Workout,
        attributes: [],
        where: {
          user_id: userId,
          status: Constants.WORKOUT.STATUS.FINISHED,
        },
      }],
      group: [[Workout, 'user_id']],
    });
  }).then(time => {
    result.total_time = time || 0;
    return Workout.count({ where: { status: Constants.WORKOUT.STATUS.FINISHED, user_id: userId } });
  }).then(count => {
    result.sessions = count;
    return result;
  });
};

module.exports = {
  getComparison,
  getDueList,
  getNextTime,
  updateCheckup,
  saveExerciseResult,
  saveExerciseResultRawData,
  completeCheckup,
  completeOutDated,
  getDueListWithCheckup,
  getUserTotalResults,
};
