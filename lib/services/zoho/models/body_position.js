/**
 * BBE-98. Update Zoho API
 * https://blumcorp.atlassian.net/browse/BBE-98
 */

const Base = require('./base');

class BodyPosition extends Base {

  static mappings() {
    return {
      id: data => data.ID,
      image: data => data.Image,
      position_name: data => data.Position_Name,
      description: data => data.Description,
    };
  }
}

module.exports = BodyPosition;
