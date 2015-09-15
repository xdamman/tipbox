module.exports = {
  beforeEach: function(client) {
    client
      .url(client.globals.base_url)
      .waitForElementVisible('body', 1000)
      .assert.title('Tipbox')
      .assert.visible('#homeView')
      .assert.visible('#homeView #content .main')
      .assert.hidden('#createView')
      .assert.hidden('#composeView')
  },

  "Display landing page": function(client) {
    client
      .assert.visible('#home')
  },

  "Display About page when clicking on sidebar link": function(client) {
    client
      .click('#open-menu')
      .waitForElementVisible('#menu', 500)
      .pause(500)
      .click('.sidebar .list > li:first-child a')
      .waitForElementNotVisible('#menu', 500)
      .assert.visible('#homeView #about')
      .assert.containsText('#about h2', 'About')
      .end();
  },

  "Display Privacy Notice page when hash is #privacy-notice": function(client) {
    client
      .url(client.globals.base_url + '/#privacy-notice')
      .assert.visible('#homeView #privacy-notice')
      .assert.containsText('#privacy-notice h2', 'Privacy Notice')
      .end();
  }
}
