var kbpgp = require('kbpgp');
var fs = require('fs');
var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var settings = require('../config/settings')(env);
var passphrase = settings.pgpKeyPassphrase;
var pgp_key = settings.pgpPrivateKey;
var ring;

function getKeyRing(){
  if (ring) {
    return ring;
  }
  ring = new kbpgp.keyring.KeyRing();
  kbpgp.KeyManager.import_from_armored_pgp({
    armored: pgp_key
  }, function(err, k) {
    if (!err) {
      if (k.is_pgp_locked()) {
        k.unlock_pgp({
          passphrase: passphrase
        }, function(err) {
          if (!err) {
            console.log('Loaded private key with passphrase');
          } else {
            console.log('Err:', err);
            process.exit();
          }

        });
      } else {
        console.log('Loaded private key w/o passphrase');
      }
      ring.add_key_manager(k);
    }
  });
  return ring;
};

// Ensure that the keys loads immediately
getKeyRing();

exports.pgp = function(req, res, next) {
  if(req.method != 'POST') return next();

  if(!req.body['encrypted']) {
    return res.status(401).send("This route requires a PGP encrypted payload");
  }

  kbpgp.unbox({keyfetch: getKeyRing(), armored: req.body.encrypted }, function(err, literals) {
    if (err !== null) {
      console.log("Decryption Error: ", err);
      return res.status(401).send("Invalid PGP payload");
    } else {
      try {
        var decrypted = JSON.parse(literals[0].data.toString());

        _.assign(req.body, decrypted.params);

        console.log("req.body: ", req.body);

        // We don't pass any data as part of the path in case of man-in-the-middle attack
        // We just post to the root path a PGP encrypted payload
        // So if we specify a path in the encrypted body, we reroute the request
        if(decrypted.path)
          req.url = decrypted.path;
      }
      catch(e) {
        console.error("Unable to parse JSON", literals, e.stack, e);
        return res.status(402).send("Invalid JSON payload");
      }
      next();
    }
  });
};
