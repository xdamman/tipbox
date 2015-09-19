var Slideout = require('slideout');

if(window.location.host == "tipbox.in" && !window.location.hash) {
  window.location.href = "https://tipbox.is";
}

window.setCurrentView = function(hash) {

  var unsupportedBrowser = function() {
    return !(window && window.crypto && window.crypto.getRandomValues && window.Uint8Array);
  }

  var previousView = window.currentView || "homeView";
  var currentView; 

  if(hash.match(/^#create/)) {
    currentView = 'createView';
  } else if(hash.match(/^#compose/)) {
    currentView = 'composeView';
    if(window.ComposeViewController) window.ComposeViewController.init();
  } else {
    currentView = 'homeView';
  }

  if(currentView != "homeView" && unsupportedBrowser()) {
    currentView = 'unsupportedBrowser'
  }

  document.querySelector('#'+previousView).classList.add('hidden');
  document.querySelector('#'+currentView).classList.remove('hidden');

  var activeModal = document.querySelector('.modal.active');
  if(activeModal) toggleModal("#"+activeModal.id);

  window.currentView = currentView;
  return currentView;
}

window.setCurrentView(window.location.hash);

// In case the hash changes before page.js is loaded
// (once page.js is loaded, window.hashchange will be overridden)
window.onhashchange = function() {
  window.setCurrentView(window.location.hash);
};

var openModalEls = document.querySelectorAll('.openModal');
for(var i=0;i<openModalEls.length; i++) {
  var el = openModalEls[i];
  el.addEventListener("click", function(e) {
    e.preventDefault();
    toggleModal('#'+this.dataset.modal);
    return false;
  });
}

var toggleModal = function(modalID) {
  var modal = document.querySelector(modalID);

  // Discarding currently active modal
  if (modal.classList.contains('active')) {
    modal.style.zIndex = 0;
    return modal.classList.toggle('active');
  }

  var currentlyActive = document.querySelectorAll(".modal.active");
  var zIndex = 15;

  if(currentlyActive.length > 0)
    zIndex = ( currentlyActive.length + 1 ) * 10;

  modal.style.zIndex = zIndex;
  modal.classList.toggle('active');
}

window.slideout = new Slideout({
  'panel': document.getElementById('content'),
  'menu': document.getElementById('menu'),
  'side': 'right'
});

document.getElementById('open-menu').addEventListener('click', function() {
  slideout.toggle();
});
