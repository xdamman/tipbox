var fs = require('fs');
var kbpgp = require('kbpgp');
var keysDir = process.KEYS_DIR || __dirname + '/../../data/keys';

kbpgp.KeyManager.generate_ecc({ userid : process.env.IDENTITY }, function(err, tbKey) {
  tbKey.sign({}, function(){
    tbKey.export_pgp_public({}, function(err, str){
      console.log("Generated Key:", str)
      console.log("Writing keys to: " + keysDir)
      fs.writeFileSync(keysDir + '/public.key', str);
      fs.writeFileSync(keysDir + '/public.key.json', JSON.stringify(str));
    })
    tbKey.export_pgp_private({passphrase: process.env.PASSPHRASE}, function(err, str){
      fs.writeFileSync(keysDir + '/private.key', str);
    })
  });
});
