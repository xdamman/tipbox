var kbpgp = require('kbpgp');

var utils = {

  filler: function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:'?>< ";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },

  /*
   * Fills the padding attribute of a request object so that all requests
   * have a similar size and look the same to potential intermediaries
   * who may be keeping a log of request sizes
   *
   * @pre: request is an object with a padding attribute
   *       sizes is an array of allowed sizes in KB, e.g. [5, 50, 1024]
   * @post: request.padding is filled with random characters in such a way
   *        that JSON.stringify(request) has the lowest length allowed
   */
  addPadding: function(request, sizes) {

    var msg = JSON.stringify(request);

    var requestSize = sizes[0] * 1024;
    for(var i=0;i<sizes.length;i++) {
      if(sizes[i] > msg.length) break;
      requestSize = sizes[i];
    }
    var padding = requestSize - msg.length;
    request.padding = utils.filler(padding);

    return request;
  },

  getJSON: function(url, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
          var obj = JSON.parse(xmlhttp.responseText);
          cb(null, obj);
         }
      }
    };
    xmlhttp.send(null);
  },

  getParam: function(param, defaultValue) {

    if(!window.location.hash) return defaultValue;

    var values = window.location.hash.substr(1).split('/');

    if(values[0] == 'create') {
      values = values.slice(1);
    } else if(values[0] == 'compose') {
      values = values.slice(1);
    }

    if(values.length != 4) return defaultValue;

    switch(param) {
      case 'recipient'   : return unescape(values[0]);
      case 'subject'     : return unescape(values[1]);
      case 'fingerprint' : return unescape(values[2]);
      case 'signature'   : return unescape(values[3]);
    }

    return defaultValue;
  },

  isEmail: function(email) {
    // regex from http://www.regular-expressions.info/email.html
    return (email && email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/i));
  },

  /*
   * Generates a MIME type email
   * @PRE: attachment is null or an object with { filename, contentType, base64 }
   */
  getMIME: function(from, subject, body, attachment) {
    var delimiter = Math.round(Math.random() * 100000000000);

    var mime = "MIME-Version: 1.0\nContent-Type: multipart/mixed; boundary=\""+delimiter+"\"\n";
    mime += "From: =?utf-8?Q?=F0=9F=91=A4?= "+from+" via Tipbox <tipbox@tipbox.is>\n";
    mime += "Subject: "+subject+"\n";
    mime += "\n";
    mime += "\n--"+delimiter+"\n";
    mime += "Content-Type: text/plain; charset=utf-8\n";
    mime += "Content-Transfer-Encoding: quoted-printable\n";
    mime += "\n";
    mime += body;

    if(attachment) {
      mime += "\n--"+delimiter+"\n";
      mime += "Content-Disposition: attachment; filename=\""+attachment.filename+"\"\n";
      mime += "Content-Type: "+attachment.contentType+"\n";
      mime += "Content-Transfer-Encoding: base64\n";
      mime += "\n";
      mime += attachment.base64+"\n";
      mime += "--"+delimiter+"--";
    }

    mime += "\n";
    mime += "\n--"+delimiter+"--\n";

    return mime;

  },

  getPGPMIME: function(from, subject, body, attachment, pgp_key, cb) {

    var mime = utils.getMIME(from, subject, body, attachment);
    var hostname = window.location.hostname;

    if(!pgp_key) {
      return cb(null, mime);
    }

    var params = {
      msg: mime,
      encrypt_for: pgp_key
    };

    kbpgp.box(params, function(err, result_string, result_buffer) {

      var delimiter = Math.round(Math.random() * 100000000000);
      var mime = "MIME-Version: 1.0\nContent-Type: multipart/encrypted; protocol=\"application/pgp-encrypted\"; boundary=\""+delimiter+"\"\n";
      mime += "From: =?utf-8?Q?=F0=9F=91=A4?= "+from+" via Tipbox <tipbox@"+hostname+">\n";
      mime += "Subject: =?utf-8?B?8J+Ukg==?= "+subject+"\n";
      mime += "\n";
      mime += "This is an OpenPGP/MIME encrypted message (RFC 4880 and 3156)\n";
      mime += "--"+delimiter+"\n";
      mime += "Content-Type: application/pgp-encrypted\n";
      mime += "Content-Description: PGP/MIME version identification\n";
      mime += "\n";
      mime += "Version: 1\n";
      mime += "\n";
      mime += "--"+delimiter+"\n";
      mime += "Content-Type: application/octet-stream; name=\"encrypted.asc\"\n";
      mime += "Content-Description: OpenPGP encrypted message\n";
      mime += "Content-Disposition: inline; filename=\"encrypted.asc\"\n";
      mime += "\n";
      mime += result_string;
      mime += "\n";
      mime += "--"+delimiter+"--\n";

      cb(err, mime);
    });
  },

  // https://github.com/filamentgroup/loadJS
  loadJS: function( src, cb ){
    "use strict";
    var ref = window.document.getElementsByTagName( "script" )[ 0 ];
    var script = window.document.createElement( "script" );
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore( script, ref );
    if (cb && typeof(cb) === "function") {
      script.onload = cb;
    }
    return script;
  }
};

module.exports = utils;
