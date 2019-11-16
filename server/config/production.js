var os = require("os");
var host = process.env.HOST || os.hostname() || 'localhost';
var port = process.env.PORT || 3000
var logger = require('../utils/logger').instance()

module.exports = function(app) {
  app.set('staticMaxAge', 0);
};
