var request = require('request')
var kbpgp = require('kbpgp')
var memoryCache = {}

// We clear the memory cache every day
setInterval(function () {
  memoryCache = {}
}, 1000 * 60 * 60 * 24)

console.log('Loading pgp latset')

function emailKeyLookup (email, cb) {
  var endpoint = 'https://keys.openpgp.org/vks/v1/by-email/'
  function done (err, resp, body) {
    if (err || resp.statusCode !== 200) {
      var errMsg = 'Error getting key: ' + resp.statusCode + ' | ' + err
      console.error(errMsg)
      return cb(err, null)
    }
    kbpgp.KeyManager.import_from_armored_pgp({ armored: body }, function (err, km) {
      if (err) {
        console.error('Error in import_from_armored_pgp', err)
        cb(err, null)
      }
      cb(null, km.get_pgp_fingerprint())
    })
  }
  request({
    method: 'GET',
    uri: endpoint + encodeURIComponent(email)
  }, done)
}

function fingerprintKeyLookup (fingerprint, cb) {
  var endpoint = 'https://keys.openpgp.org/vks/v1/by-fingerprint/'
  function done (err, resp, body) {
    console.log(err, resp.statusCode, body)
    if (err || resp.statusCode !== 200) {
      var errMsg = 'Error getting key: ' + resp.statusCode + ' | ' + err
      console.error(errMsg)
      return cb(err, null)
    }
    cb(null, body)
  }
  request({
    method: 'GET',
    uri: endpoint + fingerprint.toUpperCase()
  }, done)
}

module.exports = function (app) {
  return {

    index: function (req, res, next) {
      var email = req.body.email
      if (memoryCache['index/' + email]) return res.send(memoryCache['index/' + email])
      /* search keys with exact match */
      emailKeyLookup(email, function (err, fingerprint) {
        if (err) {
          return res.send({ keys: [] })
        }
        res.send({ keys: [{ fingerprint: fingerprint.toString('hex'), source: 'keys.openpgp.org' }] })
      })
    },

    get: function (req, res, next) {
      var fingerprint = req.body.fingerprint
      if (memoryCache['get/' + fingerprint]) return res.send(memoryCache['get/' + fingerprint])
      fingerprintKeyLookup(fingerprint, function (err, publickey) {
        if (err) {
          console.error('Error looking up fingerprint: ', err)
          return res.send({ public_key: null, error: 'Unable to find fingerprint' })
        }
        res.send({ public_key: publickey })
      })
    }

  }
}
