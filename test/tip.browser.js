module.exports = {
  beforeEach: function(client) {
    client
      .url(client.globals.base_url+"#compose/xdamman%40gmail.com/test/null/e186c59d7ab4210af96d35ac9dde8622b1c35d7b")
      .waitForElementVisible("body", 1000)
      .assert.title("Tipbox")
      .assert.visible("textarea")
      .setValue("textarea", "nightwatch")
      .assert.hidden("#pgp_fingerprint")
  },

  "Send a simple tip" : function (client) {
    client
      .click("#sendBtn")
      .waitForElementVisible("#tipSentModal", 5000)
      .assert.containsText("#tipSentModal", "xdamman@gmail.com")
      .end();
  },
  "Send a tip with attachment" : function (client) {
    client
      .setValue('input#fileToUpload', require('path').resolve(__dirname + '/testfile.txt'))
      .click("#sendBtn")
      .waitForElementVisible("#tipSentModal", 5000)
      .assert.containsText("#tipSentModal", "xdamman@gmail.com")
      .end();
  }
};
