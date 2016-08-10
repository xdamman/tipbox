var logger = require('../utils/logger').instance()

module.exports = function(app) {

  // We don't want to leave a trace on the visitor's machine
  // so we turn off caching
  app.set('staticMaxAge', 0);

  // Log a heartbeat every 10 seconds (we don't need to fill any logs here..)
  setInterval(function() {
    // On production, we only show error level or higher for privacy
    logger.prod("[-] We're still serving!");
  }, 10000);

  app.use(function(req, res, next) {
    // Let Nginx handle redirects and hostname/protocol enforcement
    // In the case of TOR, the hostname will be an .onion address
    // and TLS will unnecessary. Below we let CSP know the protocol
    // and address to enforce.
    if (req.hostname.toLowerCase().match(/.onion$/)) {
      app.set('protocol', 'http');
    } else {
      app.set('protocol', 'https');
    }
    app.set('host', req.hostname);
    next();
  });

};
