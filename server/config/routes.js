var express = require('express');
var middlewares = require('./middlewares');

module.exports = function(app) {

  // We make sure the page can't load anything from another host
  app.use(function(req, res, next) {
    var host = app.set('protocol')+'://'+app.set('host');
    res.setHeader("Content-Security-Policy","default-src 'none'; script-src "+host+" https://js.stripe.com/ https://api.stripe.com 'unsafe-eval'; style-src "+host+"; media-src "+host+"; img-src "+host+" data:; font-src "+host+"; connect-src "+host+" https://keybase.io; frame-src https://js.stripe.com/v2/");
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

  app.get('/api/*', app.controllers.donate.api);
  app.post('/api/payments', app.controllers.donate.makeDonation);

}
