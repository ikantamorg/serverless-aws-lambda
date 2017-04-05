/**
 * BBE-43.Create training program for user based on his last check up
 * https://blumcorp.atlassian.net/browse/BBE-43
 */
const Promise = require('bluebird');
const BodyZones = require('../../models/machine_exercise_body_zone').associate();
const addExercises = require('./add_exercises');

module.exports = (exerciseId, restriction, scope) => {
  const category = restriction[0];
  return BodyZones.scope({ method: ['byMachineExercise', exerciseId, category] })
      .findAll()
      .then(zones => Promise.map(zones, o =>
        BodyZones.scope({ method: ['byBodyZoneIdAndCategory', o.body_zone_id, category] })
          .findAll()
          .then(data => addExercises(restriction, data, scope))
    ));
};

