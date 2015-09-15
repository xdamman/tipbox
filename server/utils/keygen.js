var fs = require('fs');
var kbpgp = require('kbpgp');

kbpgp.KeyManager.generate_ecc({ userid : process.env.IDENTITY }, function(err, tbKey) {
  tbKey.sign({}, function(){
    tbKey.export_pgp_public({}, function(err, str){
      console.log(err, str)
      fs.writeFileSync(__dirname + '/../../keys/public.key', str);
      fs.writeFileSync(__dirname + '/../../keys/public.key.json', JSON.stringify(str));
    })
    tbKey.export_pgp_private({passphrase: process.env.PASSPHRASE}, function(err, str){
      fs.writeFileSync(__dirname + '/../../keys/private.key', str);
    })
  });
});
