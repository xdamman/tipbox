var winston = require('winston')

var logLevels = {
  levels: {
    prod: 0,
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
  },
  colors: {
    prod: 'green',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
  }
}


var sLogger;

function setup() {
  var env = process.env.NODE_ENV || 'development'
  var logLevel = require('../config/settings')(env)['logLevel'] || 'debug'
  sLogger = new winston.Logger({
    levels: logLevels.levels,
    colors: logLevels.colors,
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
