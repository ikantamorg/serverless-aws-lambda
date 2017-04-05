/**
 * BBE-9 - Access to medical info of particular user
 * https://blumcorp.atlassian.net/browse/BBE-9
 */
const BreakSignal = require('../shared/break_signal');
const Questionnaire = require('../../lib/models/questionnaire');
const UserQuestionnaire = require('../../lib/models/user_questionnaire');
const UserQuestionnaireVersion = require('../../lib/models/user_questionnaire_version');
const underscore = require('underscore');
const Promise = require('bluebird');

const isInt = (value) => {
  const x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
};

const validateAnswer = (type, answer) => {
  switch (type) {
    case 'enum: { yes, no }':
      return underscore.contains(['yes', 'no'], answer);
    case 'enum: { none, moderately, seriously }':
      return underscore.contains(['none', 'moderately', 'seriously'], answer);
    case 'integer':
      return isInt(answer);
    default:
      return false;
  }
};

module.exports = (params, user, userResponse, callback, t) => {
  const illnessParam = 'illness';
  const userIllness = underscore.propertyOf(params.user_questionnaires)(illnessParam);
  const userQuestionnaires = underscore.omit(params.user_questionnaires, [illnessParam]);
  const parentQuestionsWithYesAnswer = underscore.chain(userQuestionnaires)
    .pick(value => value === 'yes')
    .keys()
    .value();
  const userQuestionnairesTextKeys = underscore.keys(userQuestionnaires);
  const self = {};
  return Questionnaire.findAll({
    where: {
      parent_text_key: {
        $in: parentQuestionsWithYesAnswer,
      },
    },
    attributes: ['text_key'],
    transaction: t,
  })
  .then(questionnaires => {
    self.requiredChildQuestionnaires = underscore.pluck(questionnaires, 'text_key');
    return Questionnaire.findAll({
      where: {
        required: true,
      },
      attributes: ['text_key'],
      transaction: t,
    });
  })
    .then(requiredQuestionnaires => {
      let requiredTextKeys = underscore.pluck(requiredQuestionnaires, 'text_key');
      let promise;
      requiredTextKeys = requiredTextKeys.concat(self.requiredChildQuestionnaires);
      const missingKeys = underscore.difference(requiredTextKeys, userQuestionnairesTextKeys);
      if (missingKeys.length === 0) {
        promise = UserQuestionnaireVersion.create({
          user_id: user.id,
          date: new Date(),
          illness: userIllness,
        }, { transaction: t });
      } else {
        promise = new Promise((resolve, reject) => reject(missingKeys));
      }
      return promise;
    })
    .then(userQVersion => {
      self.userQVersion = userQVersion;
      userResponse.addQuestionnaireVersion(userQVersion);
      return Questionnaire.findAll({
        where: {
          text_key: { $in: userQuestionnairesTextKeys },
        },
        transaction: t,
      });
    }, (missingKeys) => {
      const response = {
        status: 422,
        errors: {
          user_questionnaires: ['Please, answer all questions', missingKeys],
        },
      };
      t.rollback();
      callback(JSON.stringify(response));
      throw new BreakSignal();
    })
    .then(allQuestionnaires =>
        Promise.each(allQuestionnaires, questionnaire => {
          let result;
          if (validateAnswer(questionnaire.value_type, userQuestionnaires[questionnaire.text_key])) {
            result = UserQuestionnaire.create({
              user_questionnaire_version_id: self.userQVersion.id,
              questionnaire_id: questionnaire.id,
              value: userQuestionnaires[questionnaire.text_key],
            }, { transaction: t }).then(userQuest => {
              userResponse.addQuestionnaireAnswer(questionnaire, userQuest);
            });
          } else {
            const response = {
              status: 422,
              errors: {
                user_questionnaires: ['Invalid answer format'],
              },
            };
            t.rollback();
            result = callback(JSON.stringify(response));
            throw new BreakSignal();
          }
          return result;
        })
    );
};
