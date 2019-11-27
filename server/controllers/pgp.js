var request = require('request');
var kbpgp = require('kbpgp');
var memoryCache = {};

// We clear the memory cache every day
setInterval(function() {
  memoryCache = {};
}, 1000*60*60*24);

console.log("Loading pgp latset")

function emailKeyLookup(email, cb) {
  var endpoint = "https://keys.openpgp.org/vks/v1/by-email/"
  function done(err, resp, body) {
    if (err || resp.statusCode !== 200) {
      return cb("Error getting key: " + resp.statusCode + " | " + err, null)
    }
    var km = kbpgp.KeyManager.import_from_armored_pgp({armored: body}, function(err, km){
      console.log(err)
      console.log(km.get_pgp_fingerprint())
      cb(null, km.get_pgp_fingerprint())
    })
  }
  request({
    method: 'GET',
    uri: endpoint+encodeURIComponent(email)
  }, done)
}

function fingerprintKeyLookup(fingerprint, cb) {
  var endpoint = "https://keys.openpgp.org/vks/v1/by-fingerprint/"
  function done(err, resp, body) {
    console.log(err, resp.statusCode, body)
    if (err || resp.statusCode !== 200) {
      return cb("Error getting key: " + resp.statusCode + " | " + err, null)
    }
    cb(null, body)
  }
  request({
    method: 'GET',
    uri: endpoint + fingerprint.toUpperCase()
  }, done)
}

module.exports = function(app) {
  return {

    index: function(req, res, next) {
      var email = req.body.email
      if(memoryCache['index/'+email]) return res.send(memoryCache['index/'+email]);
      /* search keys with exact match */
      emailKeyLookup(email, function(err, fingerprint) {
	if (err) {
          return res.send({keys:[]})
	}
        res.send({keys: [{fingerprint: fingerprint.toString('hex'), source:'keys.openpgp.org'}]});
      })
    },

    get: function(req, res, next) {
      var fingerprint = req.body.fingerprint;
      if(memoryCache['get/'+fingerprint]) return res.send(memoryCache['get/'+fingerprint]);
      fingerprintKeyLookup(fingerprint, function(err, publickey) {
        res.send({public_key: publickey});
      })
    }

  }
};
