var logger = require('../utils/logger').instance()

module.exports = function(app) {

  // We don't want to leave a trace on the visitor's machine
  // so we turn off caching
  app.set('staticMaxAge', 0);

  // Log a heartbeat every 10 seconds (we don't need to fill any logs here..)
  setInterval(function() {
    logger.prod("heartbeat");
  }, 1000);

  app.set('protocol', 'https');
  app.set('host', 'tipbox.in');

  app.use(function(req, res, next) {

    // Forces the browser to use HTTPS by default on next request https://tools.ietf.org/html/rfc6797
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

};
