var logger = require('../utils/logger').get()

module.exports = function(app) {
  app.set('staticMaxAge', 0);
  app.set('protocol', 'http');
  app.set('host', 'staging.xdamman.com:3000');
  app.use(function(req, res, next) {
    logger.info('%s %s %s', req.method, req.url, req.path);
    next();
  });
};
