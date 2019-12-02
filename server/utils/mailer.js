var SMTPConnection = require('smtp-connection')
var nodemailer = require('nodemailer')
var logger = require('./logger').instance()

var Mailer = function (settings) {
  this.settings = settings
  logger.prod('Using SMTP transport')
  this.smtpMailer = nodemailer.createTransport({
    host: (settings.smtpHost || 'localhost'),
    port: (settings.smtpPort || 25)
  })
}

Mailer.prototype.send = function (data, callback) {
  if (this.smtpMailer) {
    this.smtpMailer.sendMail(data, callback)
  }
}

Mailer.prototype.sendMime = function (data, callback) {
  if (this.smtpMailer) {
    var connection = new SMTPConnection({
      port: this.settings.smtpPort,
      host: this.settings.smtpHost
    })
    connection.connect(function () {
      var closer = function (err) {
        if (err) {
          logger.error('Error sending mime email')
          logger.warn('Error sending mime email: ', err)
        }
        connection.quit()
        callback(err)
      }
      connection.send({
        to: data.to,
        from: data.from
      }, data.message, closer)
    })
  } else {
    console.error('No SMTP transport setup')
  }
}

exports.Mailer = Mailer
