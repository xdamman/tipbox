var fs = require('fs')
var path = require('path')
var kbpgp = require('kbpgp')
var keysDir = process.KEYS_DIR || path.join(__dirname, '/../../data/keys')

kbpgp.KeyManager.generate_ecc({ userid: process.env.IDENTITY }, function (err, tbKey) {
  if (err) {
    console.err('Error generating ecc key', err)
    throw err
  }
  tbKey.sign({}, function () {
    tbKey.export_pgp_public({}, function (err, str) {
      if (err) {
        console.err('Error exporting public gpg key', err)
        throw err
      }
      console.log('Generated Key:', str)
      console.log('Writing keys to: ' + keysDir)
      fs.writeFileSync(keysDir + '/public.key', str)
      fs.writeFileSync(keysDir + '/public.key.json', JSON.stringify(str))
    })
    tbKey.export_pgp_private({ passphrase: process.env.PGP_PASSPHRASE }, function (err, str) {
      if (err) {
        console.err('Error exporting private gpg key', err)
        throw err
      }
      fs.writeFileSync(path.join(keysDir, '/private.key'), str)
    })
  })
})
