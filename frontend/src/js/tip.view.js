var TipView = function(options) {

  var self = this;

  this.$el = options.el;

  var $body = this.$el.querySelector("#tipBody");
  var $from = this.$el.querySelector("#from");
  var $pgp_fingerprint = this.$el.querySelector("#pgp_fingerprint");

  var $header = document.querySelector('#composeView header');
  var $headerTitle = document.querySelector('#composeView header h1');
  var $sendBtn = document.querySelector('#composeView header #sendBtn');
  var $progressBar = document.querySelector('#composeView #progressBar');

  this.getFrom = function() {
    return $from.value;
  };

  this.getBody = function() {
    return $body.value;
  }

  this.invalidFingerprint = function() {
    $pgp_fingerprint.classList.remove('hidden');
    $pgp_fingerprint.querySelector('span').textContent = "(INVALID FINGERPRINT)"
    $body.value = "It looks like the public PGP key for this recipient has been compromised. The fingerprint doesn't match.";
  };

  this.showFingerprint = function(fingerprint) {
    $pgp_fingerprint.classList.remove('hidden');
    $pgp_fingerprint.querySelector('span').textContent = '0x' + fingerprint.substr(32) + '';
    $pgp_fingerprint.querySelector('.padlock_svg').style.fill = '#' + fingerprint.substr(34);
    $pgp_fingerprint.classList.toggle('encrypted');
    $pgp_fingerprint.setAttribute('title','PGP fingerprint:\n'+fingerprint);
  };

  this.showProgress = function(done, total) {
    $progressBar.style.width = Math.round((done / total) * 100)+'%';
  };

  this.reset = function() {
    $header.classList.remove('error');
    $progressBar.style.width = '0px';
    $headerTitle.textContent = 'New message';
    $sendBtn.innerHTML = '<strong>Send</strong>';
    $body.value = '';
  };

  this.encrypting = function() {
    // Resetting default value in case we just hit retry
    $sendBtn.innerHTML = '';
    $header.classList.remove('error');
    $headerTitle.textContent = "Encrypting..."
    $progressBar.style.width = '0px';
  };

  this.requestEncrypted = function(reqstr) {
    $body.value = reqstr;
    $body.classList.add('encrypted');
    $headerTitle.textContent = "Sending..."
  };

  this.showError = function(err) {
    $header.classList.add('error');
    $headerTitle.textContent = err;
    $sendBtn.innerHTML = '<strong><span class="icon icon-refresh"></span> Retry</strong>';
  };

  return this;

};

module.exports = TipView;
