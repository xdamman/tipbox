var fs = require('fs');
var env = process.env;
var keysDir = process.KEYS_DIR || __dirname + '/../../keys';

var defaults = {
      'env': env.NODE_ENV,
      'pgpPrivateKey': fs.readFileSync(keysDir + '/private.key', 'utf-8'),
      'pgpPublicKey': fs.readFileSync(keysDir + '/public.key', 'utf-8'),
      'pgpKeyPassphrase': env.PGP_PASSPHRASE,
      'hostDomain': env.HOST_DOMAIN || env.MAILGUN_DOMAIN || 'tipbox.dev',
      'hmacKey': env.HMAC_KEY || '',
      'groupId': env.OC_GROUPID,
      'apiKey': env.OC_API_KEY,
      'logLevel': 'warn'
};

var settings = {
    'development': {
      'mailgunApiKey': env.MAILGUN_API_KEY,
      'mailgunDomain': env.MAILGUN_DOMAIN || 'tipbox.in',
      'smtpHost': env.SMTP_HOST,
      'smtpPort': env.SMTP_PORT,
      'pgpKeyPassphrase': '1234',
      'hmacKey': '',
      'apiUrl': 'https://opencollective.herokuapp.com/',
      'logLevel': 'debug'
    }
  , 'staging': {
      'env': env.NODE_ENV,
      'mailgunApiKey': env.MAILGUN_API_KEY,
      'mailgunDomain': env.MAILGUN_DOMAIN,
      'logLevel': 'info'
  }
  , 'tipbox.in': {
      'mailgunApiKey': env.MAILGUN_API_KEY,
      'mailgunDomain': env.MAILGUN_DOMAIN
  }
  , 'tipbox.is': {
      'smtpHost': env.SMTP_HOST,
      'smtpPort': env.SMTP_PORT,
      'apiUrl': 'https://opencollective-prod.herokuapp.com/'
  }
};

module.exports = function(name) {
  var props = {};
  for (var key in defaults) { props[key] = defaults[key]; }
  for (var key in settings[name]) { props[key] = settings[name][key]; }
  return props;
}
