/*
 * Command line tool to generate a signed URL 
 * that can be used to create a tipbox for a given email address
 *
 * Usage: node invite.js [email]
 *
 */

if(process.argv.length < 3 || !process.argv[2].match(/@/)) {
  console.log("Invalid email address");
  console.log("Usage: node invite.js email");
  process.exit(1);
}

var express = require('express');
var app = express();

var hostname = process.env.HOST_DOMAIN;
if (!hostname) {
  console.log("Error: you must explicitly set the HOST_DOMAIN");
  process.exit(1);
}

require('./server/boot')(app);

app.set('host', hostname);
app.set('protocol', 'https');

var req = { body: { recipient: process.argv[2] } };
var res = { send: function(res) { console.dir(res.url); process.exit(0) } };

var tipboxCtlr = require('./server/controllers/tipbox')(app);

tipboxCtlr.invite(req, res)
