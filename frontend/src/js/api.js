var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var Request = require('request');
var kbpgp = require('kbpgp');
var utils = require('./utils');

var requestSizesInKB = [5, 50, 1*1024, 5*1024]; // 5KB, 50KB, 1MB, 5MB

var Api = function(options) {

  var self = this;

  var r = Request.defaults({ baseUrl: window.location.protocol + '//' + window.location.host });

  /*
   * Sends a POST request to the API
   * all requests are PGP encrypted using the server's public key
   */
  var request = function(path, data, fn) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function(event) {
      console.log("Response from the server: ", this.status, this.responseText);
      try {
        var response = JSON.parse(this.responseText);
      } catch(err) {
        return fn(err);
      }
      if (this.status === 200) {
        return fn(null, response);
      }
      else {
        var error = response.error || this.status;
        return fn(new Error(error));
      }
    };

    xhr.onerror = function(event) {
      console.error("Error uploading to the server",event);
      return fn(new Error("Server unreachable"));
    };

    xhr.ontimeout = function(event) {
      console.error("Server timeout",event);
      return fn(new Error("Server timeout"));
    };

    xhr.upload.addEventListener("progress", function(e) {
      self.emit('progress', e);
    }, false);

    xhr.open('POST', '/encrypted', true);
    xhr.setRequestHeader('Content-type', 'application/json');

    var body = { path: path, params: data, padding: "" };
    body = utils.addPadding(body, requestSizesInKB);
    var msg = JSON.stringify(body);

    var params = {
      msg: msg,
      encrypt_for: self.pgp_key
    };

    kbpgp.box(params, function(err, encrypted_data, result_buffer) {
      self.emit('request_encrypted', encrypted_data);
      var body = JSON.stringify({"encrypted":encrypted_data});
      console.log("PGP request length: ", body.length);
      console.log("Sending data: ", body);
      xhr.send(body);
    });

    return xhr;

  };

  kbpgp.KeyManager.import_from_armored_pgp({ armored: options.pgp }, function(err, public_key) {
    if(err) return console.error("TipboxApi> Cannot init pgp key", options.pgp, public_key, err);
    self.pgp_key = public_key;
  });

  this.tipbox = {

    create: function(recipient, subject, fingerprint, fn) {
      console.log("creating a tipbox", arguments);
      request('/api/tipbox/create', {
          recipient: recipient
        , subject: subject
        , fingerprint: fingerprint
      }, fn);
    },

    info: function(fn) {
      r.get('/api/', function(error, response) {
        if(error) return fn(error);
        return fn(null, response);
      });
    },

  };

  this.tip = {

    send: function(recipient, fingerprint, subject, mime, signature, fn) {
      var data = {
          recipient: recipient
        , fingerprint: fingerprint
        , subject: subject
        , mime: mime
        , signature: signature
      };

      return request('/api/tip/send', data, fn);
    }

  }

  this.pgp = {

    search: function(email, fn) {
      request('/api/pgp/search', { email: email }, function(err, res) {
        if(err) return fn(err);
        fn(null, res.keys);
      });
    },

    get: function(fingerprint, fn) {
      request('/api/pgp/get', { fingerprint: fingerprint }, function(err, res) {
        if(err || !res.public_key) return fn(err);
        fn(null, res.public_key);
      });
    }

  }

  return this;

}

inherits(Api, EventEmitter);
module.exports = Api;
