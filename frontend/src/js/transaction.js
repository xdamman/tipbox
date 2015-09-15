'use strict';

var hogan = require('hogan.js');
var moment = require('moment');
var numbro = require('numbro');
var server_pgp = require('../../../keys/public.key.json');
var TipboxApi = require('./api');

var Transaction = (function() {

  var initialized = false;

  var api = new TipboxApi({pgp: server_pgp});

  var showBudget = function(page) {

    var _hideBudgetMaxValue = function(elem) {
      elem.style.display = 'none';
    };

    api.tipbox.info(function(err, res) {
      if (err) {
        console.log(err);
      } else {
        var data = JSON.parse(res.body);

        var progressBar = document.querySelector('#' + page + ' #js-progress-bar');
        var budgetLeft = document.querySelector('#' + page + ' #js-budget-left');
        var budgetTotal = document.querySelector('#' + page + ' #js-budget-total');

        var percentajeBudget = (100 * data.budgetLeft / data.budget);

        if (percentajeBudget > 91) { _hideBudgetMaxValue(budgetTotal); }

        progressBar.style.width = percentajeBudget + '%';
        budgetLeft.style.left = percentajeBudget + '%';
        budgetTotal.innerText = numbro(data.budget).format('$00a');
        budgetLeft.innerText = numbro(data.budgetLeft).format('$00a');
      }
    });
  };

  var showTransactions = function() {

    var _addMoneyCharacter = function(number) {
      if(Number(number) > 0) {
        return '$' + number;
      } else {
        var str = number.toString();
        return str.slice(0, 1) + '$' + str.slice(1, str.length);
      }
    };

    var _transformTransactions = function(transactions) {
      // TODO: Check if there is any data.
      return transactions.map(function(transaction) {
        var item = {};
        item.createdAt = moment(transaction.createdAt).fromNow();
        item.title = transaction.description;
        item.amount = _addMoneyCharacter(transaction.amount);
        return item;
      });
    };

    api.tipbox.transactions(function(err, res) {
      if (err) {
        console.log(err);
      } else {
        var transactions = _transformTransactions(JSON.parse(res.body));
        // TODO: How to know if is a donation or a spend.
        var donationItem = document.getElementById('js-spend-item').innerHTML;
        var donationList = document.getElementById('js-transaction-list');
        var template = hogan.compile(donationItem);

        transactions.forEach(function(item) {
          donationList.innerHTML += template.render(item);
        });

        donationList.style.height = 'auto';
      }
    });
  };

  function init() {
    if (!initialized) {
      showBudget('transactions');
      showTransactions();
      initialized = true;
    }
  }

  return {
    init: init,
    showBudget: showBudget
  };
})();

module.exports = Transaction;
