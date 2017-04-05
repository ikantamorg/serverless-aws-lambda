/**
 * BBE-41.Zoho integration
 * https://blumcorp.atlassian.net/browse/BBE-41
 */

const DetailModel = require('./detail');
const Base = require('./base');

const DELIMITER = ',';

class Program extends Base {

  constructor(data) {
    super(data);
    this.attributes.details = [];
  }

  getDetails() {
    return this.attributes.details;
  }
  addDetail(detail, force) {
    const forceCasting = force || false;
    this.attributes.details.push(!forceCasting ? new DetailModel(detail) : detail);
  }

  static mappings() {
    return {
      id: data => data.ID,
      detail_id: data => data['Exercise_Details.ID'].split(DELIMITER),
      program_name: data => data.Client_Name,
      new_objective: data => this.array(data.Problem),
      program_type: data => data.Program_Type,
      program_level: data => data.Program_Level,
    };
  }
}

module.exports = Program;
