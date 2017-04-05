const MachineEventMarker = require('../models/machine_event_marker');
const MachineArchive = require('../models/machine_log_archive');
const json2csv = require('json2csv');
const AWS = require('aws-sdk');
const moment = require('moment');
const _ = require('lodash');

const s3bucket = new AWS.S3({ params: { Bucket: 'blum-machine-logs' } });
const fields = ['id', 'machine_id', 'user_id', 'type', 'description', 'data', 'created_at', 'updated_at'];

AWS.config.region = 'eu-west-1';

const missingDate = callback => {
  const response = {
    status: 422,
    errors: 'Required start_date and end_date params',
  };
  callback(JSON.stringify(response));
};

const errorUploading = callback => {
  const response = {
    status: 422,
    errors: 'Cannot upload logs to bucket',
  };
  callback(JSON.stringify(response));
};

const alreadyExistLog = callback => {
  const response = {
    status: 422,
    errors: 'Log with these dates already exist',
  };
  callback(JSON.stringify(response));
};

const internalError = callback => {
  const response = {
    status: 500,
    errors: 'Internal Server Error',
  };
  callback(JSON.stringify(response));
};

const archiveMachineLogsByDates = (startDateParam, endDateParam, callback) => {
  if (!startDateParam || !endDateParam) {
    return missingDate(callback);
  }

  const startDate = moment(startDateParam).format('YYYY-MM-DD');
  const endDate = moment(endDateParam).format('YYYY-MM-DD');

  if (startDate === 'Invalid date' || endDate === 'Invalid date') {
    return missingDate(callback);
  }

  return MachineEventMarker.findAll({
    where: ['DATE(created_at) BETWEEN ? AND ?', startDate, endDate],
    raw: true,
  }).then(events => {
    const csv = json2csv({ data: events, fields });
    const params = { Key: `${startDate}_${endDate}`, Body: csv };
    return MachineArchive.findOne({
      where: {
        start_date: new Date(startDate),
        end_date: new Date(endDate),
      },
    }).then(machineArchive => {
      if (machineArchive) {
        return alreadyExistLog(callback);
      }
      return s3bucket.upload(params, (err, data) => {
        if (err) {
          return errorUploading(callback);
        }
        return MachineArchive.create({
          start_date: startDate,
          end_date: endDate,
          location: data.Location,
          bucket: data.Bucket,
          key: data.Key,
        }).then(archive =>
          MachineEventMarker.destroy({
            where: {
              id: {
                $in: _.map(events, 'id'),
              },
            },
          }).then(() =>
            callback(null, archive.toJSON())
          )
        );
      });
    });
  }).catch(() => {
    internalError(callback);
  });
};

module.exports = {
  archiveMachineLogsByDates,
};
