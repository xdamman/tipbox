"use strict";

var page = require('./page')();
var TipboxApi = require('./api');
var Tip = require('./tip');
var utils = require('./utils');
var server_pgp = require('../../../keys/public.key.json');

var api = new TipboxApi({pgp: server_pgp});
var tip;

//
// ComposeView Controller
//
window.ComposeViewController = (function() {
  var $sendBtn = document.querySelector('#sendBtn');

  var init = function() {

    /*
     * Loading the parameters from the URL
     */
    var params = {
        recipient: utils.getParam('recipient')
      , subject: utils.getParam('subject', 'No subject')
      , signature: utils.getParam('signature')
      , fingerprint: utils.getParam('fingerprint')
    }

    /*
     * Prefill the Compose View with these parameters
     */
    var els = document.querySelectorAll('[data-attr]');
    for(var i=0;i<els.length;i++) {
      var el = els[i];
      var attr = el.dataset.attr;
      if(el.attributes.title) {
        el.setAttribute('title', params[attr]);
      }
      if(params[attr]) el.textContent = params[attr];
    }

    var options = {
        el: document.querySelector('#tip')
      , recipient: params.recipient
      , subject: params.subject
      , signature: params.signature
      , api: api
    };

    if(params.fingerprint && params.fingerprint.length == 40) {
      api.pgp.get(params.fingerprint, function(err, recipient_pgp) {
        options.pgp = recipient_pgp;
        options.fingerprint = params.fingerprint;
        tip = new Tip(options);
      });
    }
    else {
      tip = new Tip(options);
    }
  }

  $sendBtn.addEventListener('click', function(e) {
    e.preventDefault();
    tip.send();
    return false;
  });

  init();

  return { init: init };
})();

//
// CreateView Controller
//
var CreateViewController = (function() {
  var createViewElem = document.getElementById('createView');
  var $recipient = createViewElem.querySelector('#recipient');
  var $subject = createViewElem.querySelector('#subject');
  var $createBtn = createViewElem.querySelector('#createBtn');
  var $errorlog = createViewElem.querySelector('#errorlog');
  var $tipboxCreated = createViewElem.querySelector('#tipboxCreated');
  var $encryptionInfo = createViewElem.querySelector('#encryptionInfo');
  var $selectPGP = createViewElem.querySelector('#selectPGP');
  var $agreeToS = createViewElem.querySelector('#agreeToS');

  var searchPGP = function() {
    var recipient = $recipient.value;
    if(!utils.isEmail(recipient)) return;

    var $spinner = document.querySelector('#encryption .spinner');
    $spinner.classList.remove('hidden');
    api.pgp.search(recipient, function(err, results) {
      $spinner.classList.add('hidden');
      $selectPGP.innerHTML = '';

      if(err || !results || results.length == 0) {
        $encryptionInfo.classList.remove('hidden');
        return;
      }

      selectedKey = null;
      if(results.length > 0) {
        $encryptionInfo.classList.add('hidden');
        $selectPGP.appendChild(createSelectableListElement("No encryption", null));

        for(var i=0; i < results.length; i++) {
          var key = new Key(results[i]);
          $selectPGP.appendChild(key.toElement());
        }
      }
    });
  };

  var recipient = utils.getParam('recipient');
  if(recipient) {
    $recipient.value = recipient;
    searchPGP();
    $subject.focus();
  }

  var Key = function(key) {
    this.fingerprint = key.fingerprint;
    this.date = key.date;
    this.bits = key.bits;
  }

  Key.prototype.toString = function() {
    return "0x"+this.fingerprint.substr(32)+" ("+this.date.slice(0,-5).replace('T',' ')+")";
  }

  var selectedKey = null;

  var selectKey = function(el, value) {
    if(selectedKey)
      selectedKey.el.classList.toggle('selected');

    selectedKey = { el: el, value: value };
    el.classList.toggle('selected');
  };

  var showError = function(msg) {
    $errorlog.querySelector('span').textContent = msg;
    $errorlog.classList.remove('hidden');
  };

  var createSelectableListElement = function(label, value) {
    var li = document.createElement('li');
    var a = document.createElement('a');

    // Select the first encryption key found
    if(!selectedKey || !selectedKey.value) {
      selectKey(a, value);
    }

    a.addEventListener('click', function(e) {
      e.preventDefault();
      selectKey(this, value);
      return false;
    });

    li.className = 'table-view-cell media';
    a.innerHTML = '<span class="media-object pull-left icon icon-check"></span>'+label;
    li.appendChild(a);

    return li;

  };

  Key.prototype.toElement = function() {
    return createSelectableListElement(this.toString(),this.fingerprint);
  }

  $recipient.addEventListener('blur', searchPGP);

  $createBtn.addEventListener('click', function(e) {
    e.preventDefault();

    var recipient = $recipient.value;
    var subject = $subject.value;
    var fingerprint = (selectedKey) ? selectedKey.value : '';

    if(!utils.isEmail(recipient))
      return showError("Invalid email address");

    if(!$agreeToS.checked)
      return showError("You must accept our Terms of Service and Privacy Policy.");

    if(!subject)
      return showError("Subject cannot be empty");

    api.tipbox.create(recipient, subject, fingerprint, function(err, res) {
      if(err) {
        console.error("Error creating the tipbox", err);
        return;
      }

      $tipboxCreated.classList.toggle('active');
    });

    return false;
  });
})();
