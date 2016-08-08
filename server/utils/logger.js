var winston = require('winston')

var sLogger;

function setup() {
  var env = process.env.NODE_ENV || 'development'
  var logLevel = require('../config/settings')(env)['logLevel'] || 'debug'
  sLogger = new winston.Logger({
    level: logLevel,
    transports: [
      new (winston.transports.Console)()
    ]
  });
  return sLogger
}

exports.instance = function() {
  if (typeof sLogger !== 'undefined') {
    return sLogger
  }
  return setup()
}
