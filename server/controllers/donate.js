'use strict';

var request = require('request');
var env = process.env.NODE_ENV || 'development';
var settings = require('../config/settings')(env);

var Donate = function(app) {
  var base = settings.apiUrl;
  var prefix = 'groups/' + settings.groupId + '/';
  var apiKey = settings.apiKey;

  var api = function(req, res) {
    var url = req.params[0] || '';
    var completeUrl = base + prefix + url + '?api_key=' + apiKey;

    req.pipe(request.get(completeUrl)).pipe(res);
  };

  var makeDonation = function(req, res) {
    var completeUrl = base + prefix + 'payments' + '?api_key=' + apiKey;

    var data = {
      amount: req.body.amount,
      stripeToken: req.body.stripeToken,
      currency: 'USD',
      beneficiary: '@tipbox',
      paidby: req.body.name + ' (' + req.body.email + ')',
      description: 'Donation',
      link: req.body.url
    };

    var payment = { payment: data };

    req.pipe(request.post(completeUrl, { form: payment })).pipe(res);
  };

  return {
    api: api,
    makeDonation: makeDonation
  };
};

module.exports = Donate;
