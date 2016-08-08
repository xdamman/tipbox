var os = require("os");
var host = process.env.HOST || os.hostname() || 'localhost';
var logger = require('../utils/logger').instance()

module.exports = function(app) {
  app.set('staticMaxAge', 0);
  app.set('protocol', 'http');
  app.set('host', host+':3000');
  app.use(function(req, res, next) {
    logger.info('%s %s %s', req.method, req.url, req.path);
    next();
  });
};
