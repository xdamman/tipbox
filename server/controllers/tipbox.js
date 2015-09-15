var crypto = require('crypto');
var escape = require('querystring').escape;
var env = process.env.NODE_ENV || 'development';
var settings = require('../config/settings')(env);
var mailer = new (require('../utils/mailer')).Mailer(settings);
var utils = require('../utils/utils');
var counter = require('../utils/counter');
var fs = require("fs");

module.exports = function(app) {

  return {
    /* Create a new tipbox
     * @PRE: recipient, subject
     * @POST: sends an email with the link to activate the tipbox
     */
    create: function(req, res, next) {
      var sig, url;

      if(!req.body.recipient || !utils.isEmail(req.body.recipient))
        return res.status(400).send({code:401,error: "Recipient must be a valid email address"})

      if(!req.body.subject)
        return res.status(400).send({code:401,error: "Subject cannot be empty"})

      var fingerprint = req.body.fingerprint || '';
      var hashBase = req.body.recipient + req.body.subject + fingerprint; 
      sig = crypto.createHmac('sha1', settings.hmacKey || '').update(hashBase).digest('hex');
      url = app.set('protocol')+'://'+app.set('host');
      url = url + '#compose/' + escape(req.body.recipient) + '/' +
        escape(req.body.subject) + '/' + fingerprint + '/' + sig;

      //TODO: Run this through a template engine
      var protip = "Share this unique URL in your Twitter Bio or in your email signature to let people know how they can reach you anonymously.\n\n#Protip: You can create multiple Tipbox as long as the subject is different. That way, you can share a unique URL to a specific community (by posting it in a forum or LinkedIn group, or in a Facebook ad) and you will know for sure that the tips with that specific subject line come from people from that particular community.";

      var data = {
        from: 'Tipbox <tipbox@'+settings.hostDomain+'>',
        to: req.body.recipient,
        subject: 'Here\'s your new Tipbox',
        text: 'Here is the URL for your new Tipbox: \n' + url + '\n\n' + protip
      };
      mailer.send(data, function(err, info){
        if (err) {
          console.log("Error sending new tipbox email: " + err);
          return res.send({code: 500, err: err});
        } else {
          console.log("New tipbox email sent: " + JSON.stringify(info));
          return res.send({code: 200, url: url});
        }
      });
      counter.incrCounter('tipbox');
    }
  };
};
