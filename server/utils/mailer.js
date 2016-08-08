var mailgun = require('mailgun-js');
var SMTPConnection = require('smtp-connection');
var nodemailer = require('nodemailer');
var logger = require('./logger').instance()

var Mailer = function(settings) {
  this.settings = settings;
  if (settings.mailgunApiKey && settings.mailgunApiKey.length > 0 && settings.mailgunDomain) {
    logger.info("Using Mailgun transport");
    this.mailgunMailer = mailgun({apiKey: settings.mailgunApiKey, domain: settings.mailgunDomain});
  } else {
    logger.info("Using SMTP transport");
    this.smtpMailer = nodemailer.createTransport({
      host: (settings.smtpHost || 'localhost'),
      port: (settings.smtpPort || 25)
    });
  }
}

Mailer.prototype.send = function(data, callback) {
  if (this.smtpMailer) {
    this.smtpMailer.sendMail(data, callback);
  } else if (this.mailgunMailer) {
    this.mailgunMailer.messages().send(data, callback);
  }
}

Mailer.prototype.sendMime = function(data, callback){
  if (this.smtpMailer) {
    var connection = new SMTPConnection({
      port: this.settings.smtpPort,
      host: this.settings.smtpHost
    });
    connection.connect(function(){
      connection.send({
        to: data.to,
        from: data.from
      }, data.message, callback);
    });
  } else if (this.mailgunMailer) {
    mailgunMailer.messages().sendMime(data, callback);
    return;
  }
}

exports.Mailer = Mailer;
