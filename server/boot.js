var bodyParser = require('body-parser');
var JobsQueue = require('./utils/job').Queue;

module.exports = function(app) {
  var env = app.get('env');

  require('./config/'+env)(app);
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.config = {
      mongodb: require('./config/mongodb')[env]
    , settings: require('./config/settings')(env)
  }

  app.controllers = {
      tipbox: require('./controllers/tipbox')(app),
      pgp: require('./controllers/pgp')(app),
      tip: require('./controllers/tip')(app),
      stats: require('./controllers/stats')(app),
  };

  app.jobs = new JobsQueue();

  require('./config/routes')(app);

};
