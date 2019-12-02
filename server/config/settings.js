var fs = require('fs')
var path = require('path')
var env = process.env
var keysDir = process.KEYS_DIR || path.join(__dirname, '/../../data/keys')

var DOMAIN = env.DOMAIN || 'tipbox.dev'
var ORIGIN = env.ORIGIN || 'https://' + DOMAIN

var defaults = {
  env: env.NODE_ENV,
  pgpPrivateKey: fs.readFileSync(keysDir + '/private.key', 'utf-8'),
  pgpPublicKey: fs.readFileSync(keysDir + '/public.key', 'utf-8'),
  pgpKeyPassphrase: env.PGP_PASSPHRASE,
  hmacKey: env.HMAC_KEY,
  domain: DOMAIN,
  // This is the web host, and inclues a protocol. You may need to
  // override it if you're using something Tor and therefore no ssl(HTTP)
  origin: ORIGIN,
  logLevel: 'error',

  // Mail settings
  smtpHost: env.SMTP_HOST,
  smtpPort: env.SMTP_PORT
}

var settings = {
  development: {
    logLevel: 'debug'
  },
  production: {
    logLevel: 'error'
  }
}

module.exports = function (name) {
  var props = {}
  for (var defaultKey in defaults) { props[defaultKey] = defaults[defaultKey] }
  for (var key in settings[name]) { props[key] = settings[name][key] }

  if (env.NODE_ENV === 'development') {
    console.log('Settings:', props)
  }

  return props
}
