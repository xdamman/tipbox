'use strict';

var Transaction = require('./transaction');
var TipboxApi = require('./api');
var utils = require('./utils');
var server_pgp = require('../../../keys/public.key.json');
var _ = require('lodash');

var Donate = (function() {

  var api = new TipboxApi({pgp: server_pgp});

  var initialized = false;

  var formElem = document.getElementById('donate-form');
  var submitElem = formElem.querySelector('.input-submit');
  var confirmationPrompt = document.getElementById('js-donation-confirmation');
  var errorPrompt = document.getElementById('js-donation-error');
  var validationErrorPrompt = document.getElementById('js-validation-error');
  var loaderElem = document.getElementById('js-loader');
  var dataInputs = {};
  var stripeInputs = {};

  (function() {
    var _inputs = formElem.querySelectorAll('[data-stripe]');
    for (var i = 0; i < _inputs.length; i++) {
      stripeInputs[_inputs[i].dataset.stripe] = _inputs[i];
    }
  })();

  (function() {
    var _inputs = formElem.querySelectorAll('[name]');
    for (var i = 0; i < _inputs.length; i++) {
      dataInputs[_inputs[i].name] = _inputs[i];
    }
  })();

  function getValuesFromInputs(_inputs) {
    return _.mapValues(_inputs, function(input) {
      return input.value;
    });
  }

  function activateSubmit() {
    submitElem.removeAttribute('disabled');
    loaderElem.classList.add('hidden');
  }

  function desactivateSubmit() {
    submitElem.setAttribute('disabled', true);
    loaderElem.classList.remove('hidden');
  }

  function togglePrompt(elem) {
    elem.classList.toggle('hidden');
    elem.querySelector('#js-close-confirmation').addEventListener('click', function() {
      elem.classList.add('hidden');
      activateSubmit();
    });
  }

  function resetForm() {
    var _inputs = _.merge(stripeInputs, dataInputs);

    _.forOwn(_inputs, function(input) {
      if(input.name !== 'amount') {
        input.value = '';
      }
      input.parentNode.classList.remove('has-error');
    });

    (function scrollToTop(){
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
      }
    })();

    document.body.style.overflow = 'visible';
  }

  function stripeResponseHandler(status, response) {
    if(response.error) {
      console.log(response.error.message);
      togglePrompt(errorPrompt);
      activateSubmit();
    } else {
      var token = response.id;

      var data = getValuesFromInputs(dataInputs);
      data.stripeToken = token;

      api.tipbox.donate(data, function(err) {
        if(err) {
          console.log('Error en la donacion', err);
          togglePrompt(errorPrompt);
        } else {
          togglePrompt(confirmationPrompt);
          confirmationPrompt.querySelector('#js-close-confirmation').addEventListener('click', resetForm);
          document.body.style.overflow = 'hidden';
        }
      });
    }
  }

  function validateForm() {
    if(!Stripe.card.validateCardNumber(stripeInputs.number.value)) {
      stripeInputs.number.parentNode.classList.add('has-error');
      return false;
    } else if(!Stripe.card.validateExpiry(stripeInputs.exp_month.value, stripeInputs.exp_year.value)) {
      stripeInputs.exp_month.parentNode.classList.add('has-error');
      return false;
    } else if(!Stripe.card.validateCVC(stripeInputs.cvc.value)) {
      stripeInputs.cvc.parentNode.classList.add('has-error');
      return false;
    } else {
      return true;
    }
  }

  function submitDonation() {
    Transaction.showBudget('donate');

    if (typeof Stripe !== 'function') { utils.loadJS('https://js.stripe.com/v2/'); }

    formElem.addEventListener('submit', function(event) {
      event.preventDefault();
      desactivateSubmit();
      if(validateForm()) {
        api.tipbox.info(function(err, res) {
          if(err) {
            console.log(err);
            togglePrompt(errorPrompt);
            activateSubmit();
          } else {
            var data = JSON.parse(res.body);
            Stripe.setPublishableKey(data.stripeManagedAccount.stripeKey);
            Stripe.card.createToken(getValuesFromInputs(stripeInputs), stripeResponseHandler);
          }
        });
      } else {
        togglePrompt(validationErrorPrompt);
      }
    });
  }

  function init() {
    if(!initialized) {
      submitDonation();
      initialized = true;
    }
  }

  return {
    init: init
  }
})();

module.exports = Donate;
