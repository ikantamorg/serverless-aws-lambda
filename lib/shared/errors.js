const ValidationResponseMapper = require('../helpers/validation_mapper');

module.exports = {
  internalError: callback => {
    const response = {
      status: 500,
      errors: 'Internal Server Error',
    };
    callback(JSON.stringify(response));
  },
  validationError: (callback, e) => {
    const response = {
      status: 422,
      errors: ValidationResponseMapper.build(e.errors),
    };
    response.errors = ValidationResponseMapper.build(e.errors);
    return callback(JSON.stringify(response));
  },
  notFoundError: (callback, message) => {
    const response = {
      status: 404,
      errors: message,
    };
    callback(JSON.stringify(response));
  },
  failedDependency: (callback, message) => {
    const response = {
      status: 424,
      errors: message,
    };
    callback(JSON.stringify(response));
  },
  incorrectCredentials: callback => {
    const response = {
      status: 403,
      errors: 'Email or password is incorrect',
      code: 'incorrect_credentials',
    };
    callback(JSON.stringify(response));
  },
  suspendedUser: callback => {
    const response = {
      status: 403,
      errors: 'user is suspended',
      code: 'suspended_user',
    };
    callback(JSON.stringify(response));
  },
  notValidParams: (callback, message) => {
    const response = {
      status: 422,
      errors: message,
    };
    callback(JSON.stringify(response));
  },
};
