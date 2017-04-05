const faker = require('faker');
require('factory-girl-sequelize')();
const factory = require('factory-girl');
const Machine = require('../../lib/models/machine');
const AdminTablet = require('../../lib/models/admin_tablet');
const AdminSettings = require('../../lib/models/gyms_admins_settings');
const MachineType = require('../../lib/models/machine_type');
const User = require('../../lib/models/user');
const UserSettings = require('../../lib/models/user_settings');
const Institution = require('../../lib/models/institution');
const Gym = require('../../lib/models/gym');
const GymsAdmin = require('../../lib/models/gyms_admin');
const InstitutionUser = require('../../lib/models/institution_user');
const Questionnaire = require('../../lib/models/questionnaire');
const UserQuestionnaire = require('../../lib/models/user_questionnaire');
const UserQuestionnaireVersion = require('../../lib/models/user_questionnaire_version');
const BodyMeasurement = require('../../lib/models/body_measurement');
const MachineEventMarker = require('../../lib/models/machine_event_marker');
const MachineLogArchive = require('../../lib/models/machine_log_archive');
const Checkup = require('../../lib/models/checkups');
const CheckupResults = require('../../lib/models/checkup_result');
const CheckupExercise = require('../../lib/models/checkup_exercise');
const WorkoutExerciseResults = require('../../lib/models/workout_exercise_result');
const CheckupExerciseResults = require('../../lib/models/checkup_exercise_result').associate();
const WorkoutExercise = require('../../lib/models/workout_exercise');
const Workout = require('../../lib/models/workout');
const UsersService = require('../../lib/models/users_service');
const UsersPublicAuth = require('../../lib/models/users_public_auth_session');
const WorkoutResult = require('../../lib/models/workout_result');
const crypto = require('crypto');


factory.define('usersService', UsersService, {
  service_id: faker.random.number(10),
});

factory.define('machine', Machine, {
  machine_type_id: factory.assoc('machineType', 'id'),
  hash_id: factory.sequence(() => crypto.randomBytes(4).toString('hex')),
  secure_token: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
  machine_identifier: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
});

factory.define('adminTablet', AdminTablet, {
  gym_id: factory.assoc('gym', 'id'),
  hash_id: factory.sequence(() => crypto.randomBytes(4).toString('hex')),
  secure_token: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
  tablet_identifier: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
  status: 0,
});

factory.define('suspendedMachine', Machine, {
  machine_type_id: factory.assoc('machineType', 'id'),
  hash_id: factory.sequence(() => crypto.randomBytes(4).toString('hex')),
  secure_token: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
  machine_identifier: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
  status: 1,
});

factory.define('machineType', MachineType, {
  sku: factory.sequence(() => `${faker.random.uuid()}`),
  name: factory.sequence(n => `${n}${faker.commerce.productName()}`),
  description: faker.lorem.sentence(),
  comments: faker.lorem.sentence(),
});

factory.define('user', User, {
  email: factory.sequence(n => `${n}${faker.internet.email()}`),
  phone: faker.phone.phoneNumber(),
  postal_address_line_1: faker.address.streetAddress(),
  postal_address_line_2: faker.address.secondaryAddress(),
  address_line_1: faker.address.streetAddress(),
  address_line_2: faker.address.secondaryAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
  country: faker.address.country(),
  zip_code: faker.address.zipCode(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  gender: 0,
  date_of_birthday: faker.date.past(),
  emergency_contact_name: faker.name.findName(),
  emergency_contact_phone: faker.phone.phoneNumber(),
  status: 0,
  users_service_id: factory.assoc('usersService', 'id', { user_id: faker.random.number(10) })
});

factory.define('userSettings', UserSettings, {
  user_id: factory.assoc('user', 'id'),
});

factory.define('adminSettings', AdminSettings, {
  gyms_admin_id: factory.assoc('gymsAdmin', 'id'),
  unit_of_length: 'm/cm',
  language: 'en',
  unit_of_weight: 'kg',
  notification_frequency_const : {
    '1': 'true', '5': 'true', '10': 'true', '15': 'true', '20': 'true', '25': 'true', '30': 'true', '45': 'true'
  },
});

factory.define('gymsAdmin', GymsAdmin, {
  gym_id: factory.assoc('gym', 'id'),
  email: factory.sequence(n => `${n}${faker.internet.email()}`),
  encrypted_password: faker.random.word(),
  salt: faker.random.word(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  address_line_1: faker.address.streetAddress(),
  address_line_2: faker.address.secondaryAddress(),
  city: faker.address.city(),
  country: faker.address.country(),
  state: faker.address.state(),
  zip_code: faker.address.zipCode(),
  status: 0,
  token: factory.sequence(n => `${n}${faker.random.uuid()}`),
});

factory.define('institution', Institution, {
  email: factory.sequence(n => `${n}${faker.internet.email()}`),
  name: factory.sequence(n => `${n}${faker.commerce.productName()}`),
  phone: faker.phone.phoneNumber(),
  postal_address_line_1: faker.address.streetAddress(),
  postal_address_line_2: faker.address.secondaryAddress(),
  address_line_1: faker.address.streetAddress(),
  address_line_2: faker.address.secondaryAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
  country: faker.address.country(),
  zip_code: faker.address.zipCode(),
});

factory.define('gym', Gym, {
  institution_id: factory.assoc('institution', 'id'),
  email: factory.sequence(n => `${n}${faker.internet.email()}`),
  name: factory.sequence(n => `${n}${faker.commerce.productName()}`),
  phone: faker.phone.phoneNumber(),
  address_line_1: faker.address.streetAddress(),
  address_line_2: faker.address.secondaryAddress(),
  city: faker.address.city(),
  state: faker.address.state(),
  country: faker.address.country(),
  zip_code: faker.address.zipCode(),
  longitude: factory.sequence(() => faker.address.longitude()),
  latitude: factory.sequence(() => faker.address.latitude()),
  full_address: factory.sequence(n => faker.address.streetAddress()),
  about: factory.sequence(() => faker.lorem.sentence()),
  image: factory.sequence(() => faker.lorem.word()),
  bucket: factory.sequence(() => faker.lorem.word()),
});

factory.define('institutionUser', InstitutionUser, {
  institution_id: factory.assoc('institution', 'id'),
  user_id: factory.assoc('user', 'id'),
  gym_id: factory.assoc('gym', 'id'),
  registered_at: faker.date.past(),
  user_tag: factory.sequence(n => `${n}${faker.random.uuid()}`),
});

factory.define('institutionUserWithSuspendedUser', InstitutionUser, {
  user_id: factory.assoc('user', 'id', { status: 1 }),
  registered_at: faker.date.past(),
  user_tag: factory.sequence(n => `${n}${faker.random.uuid()}`),
});

factory.define('questionnaire', Questionnaire, {
  category: factory.sequence(n => `${n}${faker.commerce.productName()}`),
  text_key: factory.sequence(() => crypto.randomBytes(10).toString('hex')),
  code: factory.sequence(() => crypto.randomBytes(4).toString('hex')),
  value_type: 'enum: {yes,no}',
  required: true,
});


factory.define('userQuestionnaireVersion', UserQuestionnaireVersion, {
  date: faker.date.past(),
});

factory.define('userQuestionnaire', UserQuestionnaire, {
  value: 'yes',
  user_questionnaire_version_id: factory.assoc('userQuestionnaireVersion', 'id'),
});

factory.define('bodyMeasurements', BodyMeasurement, {
  height: 30,
  weight: 80,
  chest: 30,
  arm: 20,
  waist: 40,
  hips: 50,
  thigh: 35,
});

factory.define('machineEventMarker', MachineEventMarker, {
  machine_id: factory.assoc('machine', 'id'),
  type: faker.random.word(),
  description: faker.random.word(),
  data: faker.random.word(),
});

factory.define('machineLogArchive', MachineLogArchive, {
  start_date: faker.date.past(),
  end_date: faker.date.past(),
  location: faker.random.word(),
  bucket: faker.random.word(),
  key: faker.random.word(),
});

factory.define('gymsAdminWithoutGymId', GymsAdmin, {
  email: faker.internet.email(),
  encrypted_password: faker.random.word(),
  salt: faker.random.word(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  address_line_1: faker.address.streetAddress(),
  address_line_2: faker.address.secondaryAddress(),
  city: faker.address.city(),
  country: faker.address.country(),
  state: faker.address.state(),
  zip_code: faker.address.zipCode(),
  token: faker.random.uuid(),
  status: 0,
});

factory.define('institutionUserWithoutInstitutionIdAndGymId', InstitutionUser, {
  user_id: factory.assoc('user', 'id'),
  registered_at: faker.date.past(),
  user_tag: factory.sequence(n => `${n}${faker.random.uuid()}`),
});

factory.define('checkupWithoutUser', Checkup, {
});

factory.define('checkupResultsWithoutCheckup', CheckupResults, {
  date: faker.date.future(),
});

factory.define('suspendedAdminTablet', AdminTablet, {
  gym_id: factory.assoc('gym', 'id'),
  hash_id: factory.sequence(() => crypto.randomBytes(4).toString('hex')),
  secure_token: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
  tablet_identifier: factory.sequence(() => crypto.randomBytes(12).toString('hex')),
  status: 1,
});

factory.define('suspendedGymsAdminWithoutGymId', GymsAdmin, {
  email: faker.internet.email(),
  encrypted_password: faker.random.word(),
  salt: faker.random.word(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  address_line_1: faker.address.streetAddress(),
  address_line_2: faker.address.secondaryAddress(),
  city: faker.address.city(),
  country: faker.address.country(),
  state: faker.address.state(),
  zip_code: faker.address.zipCode(),
  token: faker.random.uuid(),
  status: 1,
});

factory.define('exerciseResultWithoutWorkout', WorkoutExerciseResults, {
  workout_exercise_id: faker.random.number(100),
  balance: faker.random.number(100),
  symmetry: faker.random.number(100),
  movement: faker.random.number(100),
  range: faker.random.number(100),
  qom: faker.random.number(100),
  strength: faker.random.number(10),
  feedback: faker.random.number(3),
});

factory.define('workoutWithoutUser', Workout, {
  workout_program_id: faker.random.number(10),
  date: faker.date.future(),
  total_time: faker.random.number(1000),
  status: 0,
});

factory.define('workout', Workout, {
  workout_program_id: faker.random.number(10),
  date: faker.date.future(),
  total_time: faker.random.number(1000),
  status: 0,
  user_id: factory.assoc('user', 'id'),
});

factory.define('checkupExerciseResult', CheckupExerciseResults, {
  balance: faker.random.number(10),
  symmetry: faker.random.number(10),
  date: faker.date.recent(),
  movement: faker.random.number(10),
  range_of_motion: faker.random.number(10),
  strength: faker.random.number(10),
});

factory.define('checkupExercise', CheckupExercise, {
  checkup_id: factory.assoc('checkup', 'id'),
  balance: faker.random.number(10),
  machine_type: faker.random.word(),
  symmetry: faker.random.number(10),
  date: faker.date.recent(),
  movement: faker.random.number(10),
  range_of_motion: faker.random.number(10),
  strength: faker.random.number(10),
});

factory.define('workoutExercise', WorkoutExercise, {
  completed: false,
  machine_type: 'MachineType',
  category: 1,
  workout_id: faker.random.number(100),
});

factory.define('exerciseResultWithExercise', WorkoutExerciseResults, {
  workout_exercise_id: factory.assoc('workoutExercise'),
  date: new Date(),
  workout_id: faker.random.number(100),
  balance: faker.random.number(100),
  symmetry: faker.random.number(100),
  movement: faker.random.number(100),
  range: faker.random.number(100),
  qom: faker.random.number(100),
  strength: faker.random.number(10),
  feedback: faker.random.number(3),
});

factory.define('usersPublicAuth', UsersPublicAuth, {
  user_id: factory.assoc('user', 'id'),
  token: factory.sequence(n => `${n}${faker.random.uuid()}`),
  expiration_date: faker.date.future(),
});

factory.define('usersPublicAuthWithSuspendedUser', UsersPublicAuth, {
  user_id: factory.assoc('user', 'id', { status: 1 }),
  token: factory.sequence(n => `${n}${faker.random.uuid()}`),
  expiration_date: faker.date.future(),
});


factory.define('workoutResult', WorkoutResult, {
  workout_id: factory.assoc('workout', 'id'),
  date: faker.date.past(),
  balance: faker.random.number(),
  movement: faker.random.number(),
  range: faker.random.number(),
  strength: faker.random.number(),
  symmetry: faker.random.number(),
  qom: faker.random.number(),
});

factory.define('workoutResultWithoutWorkout', WorkoutResult, {
  date: faker.date.past(),
  balance: faker.random.number(),
  movement: faker.random.number(),
  range: faker.random.number(),
  strength: faker.random.number(),
  symmetry: faker.random.number(),
  qom: faker.random.number(),
});

factory.define('checkup', Checkup, {
  user_id: factory.assoc('user', 'id'),
});

module.exports = factory;
