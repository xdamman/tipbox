var express = require('express');
var middlewares = require('./middlewares');

module.exports = function(app) {

  app.use(function(req, res, next) {

    // Default to the request protocol and hostName as the origin
    var host = app.config.settings.domain || req.get('host')
    var origin = 'https://' + host

    // Let us override this in certain cases (eg. HTTP over Tor)
    if (app.config.settings.origin) {
      origin = app.config.settings.origin
    }

    // Enforce a strong CSP Policy
    res.setHeader("Content-Security-Policy","default-src 'none'; script-src 'self'; style-src 'self'; media-src 'self'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'");

    next();
  });

  var src = (app.set('env') == 'development') ? 'src' : 'dist';
  app.use('/', express.static(__dirname+"/../../frontend/"+src+"/", {maxAge: 0}));

  app.use(middlewares.pgp);

  app.post('/api/tipbox/create', app.controllers.tipbox.create);
  app.post('/api/tip/send', app.controllers.tip.send);
  app.post('/api/pgp/search', app.controllers.pgp.index);
  app.post('/api/pgp/get', app.controllers.pgp.get);
  app.get('/api/stats', app.controllers.stats.get);
}
