var express = require('express');
var os = require("os");
var app = express();

app.set('env', process.env.NODE_ENV || "development");

require('./boot')(app);

process.on('SIGTERM', function() {
  console.log("Received SIGTERM");

  app.jobs.runAll(function() {
    console.log("All jobs done, exiting");
    process.exit(0);
  });

});

var port = process.env.PORT || 3000;
var host = process.env.HOST || os.hostname() || 'localhost';
console.log("Listening on " + host + ":" + port+" in "+app.get('env')+" environment, pid: "+process.pid);
app.listen(port, host);
