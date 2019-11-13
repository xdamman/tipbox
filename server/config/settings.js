var fs = require('fs');
var env = process.env;
var keysDir = process.KEYS_DIR || __dirname + '/../../keys';

var defaults = {
      'env': env.NODE_ENV,
      'pgpPrivateKey': fs.readFileSync(keysDir + '/private.key', 'utf-8'),
      'pgpPublicKey': fs.readFileSync(keysDir + '/public.key', 'utf-8'),
      'pgpKeyPassphrase': env.PGP_PASSPHRASE,
      'domain': env.DOMAIN || env.MAILGUN_DOMAIN || 'tipbox.dev',
      'logLevel': 'error'
};

var settings = {
    'development': {
      'mailgunApiKey': env.MAILGUN_API_KEY,
      'mailgunDomain': env.MAILGUN_DOMAIN || 'tipbox.dev',
      'smtpHost': env.SMTP_HOST,
      'smtpPort': env.SMTP_PORT,
      'logLevel': 'debug'
    },
    'production': {
      'mailgunApiKey': env.MAILGUN_API_KEY,
      'mailgunDomain': env.MAILGUN_DOMAIN || 'tipbox.dev',
      'smtpHost': env.SMTP_HOST,
      'smtpPort': env.SMTP_PORT,
      'logLevel': 'error'
    }
};

module.exports = function(name) {
  var props = {};
  for (var key in defaults) { props[key] = defaults[key]; }
  for (var key in settings[name]) { props[key] = settings[name][key]; }
  return props;
}
