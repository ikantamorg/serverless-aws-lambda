/**
 * BBE-98. Update Zoho API
 * https://blumcorp.atlassian.net/browse/BBE-98
 */

const Base = require('./base');

class BodyPosition extends Base {

  static mappings() {
    return {
      id: data => data.ID,
      image: data => data['Setting.Image'],
      name: data => data.Setting_Data_Lookup,
      setting_id: data => data['Setting.ID'],
      description: data => data['Setting.Description'],
      title: data => data['Setting.Title'],
      option: data => data.Options,
      option_description: data => data.Degree,
    };
  }
}

module.exports = BodyPosition;
