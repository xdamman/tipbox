var os = require("os");
var host = process.env.HOST || os.hostname() || 'localhost';
var port = process.env.PORT || 3000
var logger = require('../utils/logger').instance()

module.exports = function(app) {
  app.use(function(req, res, next) {
    logger.info('%s %s %s', req.method, req.url, req.path);
    next();
  });
};
