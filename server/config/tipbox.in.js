module.exports = function(app) {

  // We don't want to leave a trace on the visitor's machine
  // so we turn off caching
  app.set('staticMaxAge', 0);

  // We make sure we don't log anything
  // except a heartbeat every second to fill up the 1,500 backlog of Heroku in 25mn
  var log = console.log;
  setInterval(function() {
    log("heartbeat");
  }, 1000);

  console.log = console.error = function() {};

  app.set('protocol', 'https');
  app.set('host', 'tipbox.in');

  app.use(function(req, res, next) {

    // Forces the browser to use HTTPS by default on next request https://tools.ietf.org/html/rfc6797
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

};
