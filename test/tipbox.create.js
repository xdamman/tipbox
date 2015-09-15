module.exports = {
  before: function(client) {
    client
      .url(client.globals.base_url+"#create")
      .waitForElementVisible("body", 1000)
      .assert.title("Tipbox")
  },
  "Create a new tipbox without PGP" : function (client) {
    client
      .setValue("#recipient","xdamman@gmail.com")
      .setValue("#subject","nightwatch")
      .click('#agreeToS')
      .waitForElementVisible("#selectPGP a.selected", 5000)
      .click("#selectPGP a")
      .assert.containsText("#selectPGP a.selected", "No encryption")
      .click("#createBtn")
      .waitForElementVisible("#tipboxCreated", 5000)
      .assert.containsText("#tipboxCreated", "Your tipbox has been created")
      .end();
  }
};
