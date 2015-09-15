var os = require('os');
var host = os.hostname();

module.exports = {
  'default': {
    'host': host,
    'base_url': "http://"+host+":3000"
  }
}
