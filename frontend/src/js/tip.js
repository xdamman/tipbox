var AttachmentManager = require('./attachmentManager')
var TipView = require('./tip.view')
var kbpgp = require('kbpgp')
var utils = require('./utils')

module.exports = function (options) {
  var self = this

  var api = options.api

  this.view = new TipView(options)

  this.recipient = options.recipient
  this.subject = options.subject
  this.signature = options.signature
  this.fingerprint = options.fingerprint
  this.attachment = new AttachmentManager({ el: options.el })

  if (options.pgp) {
    kbpgp.KeyManager.import_from_armored_pgp({ armored: options.pgp }, function (err, publicKey) {
      if (err) return console.error('Cannot init recipient key', publicKey, err)

      self.pgpKey = publicKey
      var fingerprint = publicKey.get_pgp_fingerprint().toString('hex').toUpperCase()
      if (fingerprint.toUpperCase() !== self.fingerprint.toUpperCase()) {
        // This should never happen
        console.error('Invalid fingerprint')
        self.fingerprint = fingerprint
        self.view.invalidFingerprint()
      } else {
        self.view.showFingerprint(fingerprint)
      }
    })
  }

  /*
   * Encrypt the body of the message with the PGP of the recipient *if any*
   */

  this.send = function () {
    self.view.encrypting()

    self.mime = utils.getPGPMIME(self.view.getFrom(), self.subject, self.view.getBody(), self.attachment.getObject(), self.pgpKey, function (err, mime) {
      if (err) {
        console.error('Unable to getPGPMIME', err)
        throw (err)
      }
      if (mime.length / 1024 / 1024 > 5) {
        // Email too big
        self.view.showError('Email too big (max 5MB)')
        return
      }

      api.tip.send(self.recipient, self.fingerprint, self.subject, mime, self.signature, function (err, res) {
        if (err) {
          console.error('Error uploading to the server', err)
          self.view.showError(err)
          return
        }
        document.querySelector('#tipSentModal').classList.toggle('active')
        self.view.reset()
        setTimeout(function () {
          window.location.hash = '#home'
        }, 10000)
      })

      // Listen to the upload progress.
      api.on('progress', function (e) {
        if (e.lengthComputable) {
          console.log('progress: ', Math.round((e.loaded / e.total) * 100) + '%')
          self.view.showProgress(e.loaded, e.total)
        }
      })

      api.on('request_encrypted', function (encryptedMsg) {
        self.view.requestEncrypted(encryptedMsg)
      })
    })
  }

  return {
    send: this.send
  }
}
