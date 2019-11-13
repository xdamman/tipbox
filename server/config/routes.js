var express = require('express');
var middlewares = require('./middlewares');

module.exports = function(app) {

  app.use(function(req, res, next) {

    // Default to the request protocol and hostName as the origin
    var protocol = req.protocol // Allow for nonSSL for cases like tor
    var host = app.config.setting.domain || req.get('host')
    var origin = protocol + '://' + host

    // Let us override this in certain cases
    if (app.config.settings.origin) {
      origin = app.config.settings.origin
    }

    // Enforce a strong CSP Policy
    res.setHeader("Content-Security-Policy","default-src 'none'; script-src "+origin+"; style-src "+origin+"; media-src "+origin+"; img-src "+origin+" data:; font-src "+origin+" data:; connect-src "+origin+" https://keybase.io;");

    next();
  });

  var src = (app.set('env') == 'development') ? 'src' : 'dist';
  app.use('/', express.static(__dirname+"/../../frontend/"+src+"/", {maxAge: app.get('staticMaxAge')}));

  app.use(middlewares.pgp);

  app.post('/api/tipbox/create', app.controllers.tipbox.create);
  app.post('/api/tip/send', app.controllers.tip.send);
  app.post('/api/pgp/search', app.controllers.pgp.index);
  app.post('/api/pgp/get', app.controllers.pgp.get);
  app.get('/api/stats', app.controllers.stats.get);
}
