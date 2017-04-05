/**
 * BBE-41.Zoho integration
 * https://blumcorp.atlassian.net/browse/BBE-41
 */

const Base = require('./base');
const BodyPosition = require('./body_position');
const Setting = require('./setting');

class Detail extends Base {

  constructor(data) {
    super(data);
    this.attributes.body_positions = [];
    this.attributes.settings = [];
  }

  addPosition(position, force) {
    const forceCasting = force || false;
    this.attributes.body_positions.push(!forceCasting ? new BodyPosition(position) : position);
  }

  addSetting(setting, force) {
    const forceCasting = force || false;
    this.attributes.settings.push(!forceCasting ? new Setting(setting) : setting);
  }

  static mappings() {
    return {
      id: data => data.ID,
      range: data => data.Range,
      number_of_repetitions: data => data.Number_Of_Repititions,
      machine: data => data.Machine,
      exercise_name: data => data.Exercise_Name,
      exercise_description: data => data['Exercise_Name.Description'],
      exercise_key: data => data.Exercise_Key,
      body_position_id: data => this.array(data['Body_Position.ID']),
      body_zones: data => this.array(data['Exercise_Name.Body_Zones']),
      tempo: data => data.Tempo,
      settings_id: data => this.array(data['Setting_Options.ID']),
      curve: data => data.Curve,
      image: data => data.Image_URL,
      machine_settings: data => data.Machine_Settings,
      video: data => data.Video,
    };
  }
}

module.exports = Detail;
