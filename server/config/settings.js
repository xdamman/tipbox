var fs = require('fs');
var env = process.env;
var keysDir = process.KEYS_DIR || __dirname + '/../../data/keys';

var DOMAIN = env.DOMAIN || env.MAILGUN_DOMAIN || 'tipbox.dev'
var ORIGIN =  env.ORIGIN || 'https://' + DOMAIN

var defaults = {
  'env': env.NODE_ENV,
  'pgpPrivateKey': fs.readFileSync(keysDir + '/private.key', 'utf-8'),
  'pgpPublicKey': fs.readFileSync(keysDir + '/public.key', 'utf-8'),
  'pgpKeyPassphrase': env.PGP_PASSPHRASE,
  'domain': DOMAIN,
  // This is the web host, and inclues a protocol. You may need to
  // override it if you're using something Tor and therefore no ssl(HTTP)
  'origin': ORIGIN,
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
