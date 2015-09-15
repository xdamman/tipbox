module.exports = {
  beforeEach: function(client) {
    client
      .url(client.globals.base_url+"#compose/xdamman%40gmail.com/this%20is%20a%20very%20long%20subject%20line%20because%20why%20not%2C%20everything%20is%20possible/44A7D05FF1F6D0B80F7915A614261B13FD430CDC/6015342963b854fefb7a66b6dbd72aa77d42999a")
      .waitForElementVisible("body", 1000)
      .assert.title("Tipbox")
      .assert.visible("textarea")
      .setValue("textarea", "nightwatch")
      .waitForElementVisible("#pgp_fingerprint", 5000)
      .assert.containsText("#pgp_fingerprint", "0xFD430CDC")
  },
  "Send a simple encrypted tip" : function (client) {
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
