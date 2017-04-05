/**
 * BBE-41.Zoho integration
 * https://blumcorp.atlassian.net/browse/BBE-41
 */

const zohoCRM = require('zoho');
const zohoConfig = require('../../../config/zoho_config');
const Promise = require('bluebird');
const _ = require('lodash');

const ProgramModel = require('./models/program');
const DetailModel = require('./models/detail');

function ZohoService(cnfg) {
  let config = cnfg;
  let creator = new zohoCRM.Creator({ authtoken: config.auth_token });

  const getFromView = (view, params) => {
    const func = Promise.promisify(creator.viewRecordsInView, { context: creator });
    return func(config.application_name, view, params).then(data => {
      let promise;
      if (_.chain(data).toPairs().first().nth(1)
          .isEmpty()
          .value()) {
        promise = new Promise((resolve, reject) => reject('Records Not Found'));
      } else {
        promise = new Promise(resolve => resolve(data));
      }
      return promise;
    });
  };

  const programList = params => getFromView(config.program_view, params);
  const detailList = params => getFromView(config.program_details_view, params);
  const positionList = params => getFromView(config.body_position_view, params);
  const settingList = params => getFromView(config.setting_view, params);

  const fetchProgram = model =>
    Promise.map(model.attributes.detail_id, detailId =>
      this.getDetailById(detailId).then(detail => {
        const detailModel = new DetailModel(detail.ProgExercise_Detail_Subform[0]);
        model.addDetail(detailModel, true);
        return Promise.map(detailModel.attributes.body_position_id, positionId =>
          this.getPositionById(positionId)
            .then(position => {
              detailModel.addPosition(_.first(position.Body_Position));
            })
        ).then(() =>
          Promise.map(detailModel.attributes.settings_id, settingId =>
            this.getSettingById(settingId)
              .then(setting => {
                detailModel.addSetting(_.first(setting.Settings_Data));
              })
          )
        );
      })
    );

  this.setConfig = newConfig => {
    config = newConfig;
    creator = new zohoCRM.Creator({ authtoken: config.auth_token });
  };

  this.getProgramByName = (name) => programList({ criteria: `Client_Name==${name}` })
    .then(data => {
      const models = [];
      return Promise.each(data.New_Program, program => {
        const model = new ProgramModel(program);
        return fetchProgram(model).then(() => {
          models.push(model);
        });
      }).then(() => new Promise(resolve => resolve(models)));
    });

  this.getProgramById = id => {
    const self = {};
    return programList({ criteria: `ID=${id}` }).then(data => {
      self.model = new ProgramModel(_.first(data.New_Program));
      return fetchProgram(self.model);
    })
      .then(() => new Promise(resolve => resolve(self.model)));
  };
  this.getDetailById = id => detailList({ criteria: `ID=${id}` });
  this.getPositionById = id => positionList({ criteria: `ID=${id}` });
  this.getSettingById = id => settingList({ criteria: `ID=${id}` });
}

module.exports = new ZohoService(zohoConfig);
