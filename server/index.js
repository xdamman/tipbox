var express = require('express');
var os = require("os");
var app = express();
var logger = require('./utils/logger').get()

app.set('env', process.env.NODE_ENV || "development");

require('./boot')(app);

process.on('SIGTERM', function() {
  logger.info("Received SIGTERM");

  app.jobs.runAll(function() {
    logger.info("All jobs done, exiting");
    process.exit(0);
  });

});

var port = process.env.PORT || 3000;
var host = process.env.HOST || os.hostname() || 'localhost';
logger.info("Listening on " + host + ":" + port+" in "+app.get('env')+" environment, pid: "+process.pid);
app.listen(port, host);
