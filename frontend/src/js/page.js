/**
 * Page switcher
 */
var Donate = require('./donate');
var Transaction = require('./transaction');

module.exports = function() {
  'use strict';
  var pages = {
    'home': {
      type: 'home-view',
      init: null
    },
    'about': {
      type: 'text-page',
      init: null
    },
    'faq': {
      type: 'text-page',
      init: null
    },
    'security': {
      type: 'text-page',
      init: null
    },
    'donate': {
      type: 'donation-page',
      init: Donate.init
    },
    'transactions': {
      type: 'transaction-page',
      init: Transaction.init
    },
    'tos': {
      type: 'text-page',
      init: null
    },
    'privacy-notice': {
      type: 'text-page',
      init: null
    }
  };
  var currentPage = window.location.hash;
  var homeView = document.getElementById('homeView');
  var pageLinks = homeView.querySelectorAll('a[data-page]');
  var contentWrapper = homeView.querySelector('#content');

  function isValidPage(pageId) {
    return pageId.substr(1) in pages;
  }

  function togglePage(pageId) {
    var activePage = homeView.querySelector('main.active');

    if(activePage) {
      activePage.classList.toggle('hidden');
      activePage.classList.remove('active');
    }

    window.scrollTo(0, 0);

    if(isValidPage(pageId)) {

      window.setCurrentView('#homeView');

      var $page = homeView.querySelector(pageId);
      var page = pages[pageId.substr(1)];

      $page.classList.toggle('hidden');
      $page.classList.add('active');

      contentWrapper.className = '';
      contentWrapper.classList.add(page.type);

      if(typeof page.init === 'function') {
        pages[pageId].init();
      }

    } else {
      if(pageId == "#create") {
        window.setCurrentView("#create");        
      }
      else if(pageId.match(/^#compose/)) {
        window.setCurrentView("#compose");
      }
      else {
        togglePage('#home');
      }
    }

    if (window.slideout) window.slideout.close();
  }

  window.onhashchange = function() {
    togglePage(window.location.hash);
  };

  if(currentPage !== '' && isValidPage(currentPage)) { togglePage(currentPage); }
};
