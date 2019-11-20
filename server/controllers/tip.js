var crypto = require('crypto');
var escape = require('querystring').escape;
var env = process.env.NODE_ENV || 'development';
var settings = require('../config/settings')(env);
var mailer = new (require('../utils/mailer')).Mailer(settings);
var counter = require('../utils/counter')
var Job = require('../utils/job').Job;
var logger = require('../utils/logger').instance()

module.exports = function(app) {

  return {

    send: function(req, res, next) {
      var sig, url;
      var hashBase = req.body.recipient + req.body.subject + (req.body.fingerprint || '');
      var sig = crypto.createHmac('sha1', settings.hmacKey || '').update(hashBase).digest('hex');
      logger.debug(sig, ':', req.body.signature);
      if (req.body.signature === sig) {
        var data, job, delay;

        data = {
          to: req.body.recipient,
          from: 'tipbox@'+settings.domain,
          subject: req.body.subject,
          message: req.body.mime
        };

        if (settings.env === 'development') {
          delay = 3*1000; // Delaying job execution by 3s
          job = new Job(function(data, fn) {
            mailer.sendMime(data, function (error, body) {
                fn(error, body);
            });
            counter.incrCounter('tip');
          }, data);

        } else {
          // We will actually send the email in between 10 and 20mn
          // to make sure one observer cannot compare and synchronize logs
          delay = 10*60*1000 + Math.round(Math.random() * 10*60*1000);
          job = new Job(function(data, fn) {
            mailer.sendMime(data, function (error, body) {
                fn(error, body);
            });
            counter.incrCounter('tip');
          }, data);
        }

        app.jobs.add(job, delay);

        return res.send({code: 200, status:"ok"});
      }
      else {
        return res.status(400).send({code: 400, error: "Invalid signature"});
      }
      return res.status(500).send({code: 500, error: "FAIL"});
    }

  };

};
