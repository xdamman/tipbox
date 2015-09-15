module.exports = {
  before: function(client) {
    client
      .url(client.globals.base_url+"#create")
      .waitForElementVisible("body", 1000)
      .assert.title("Tipbox")
      .setValue("#recipient","xdamman@gmail.com")
      .click("#subject")
      .waitForElementVisible("#selectPGP a.selected", 5000)
      .assert.containsText("#selectPGP a.selected", "0xFD430CDC");
  },
  "Subject cannot be empty" : function (client) {
    client
      .click('#agreeToS')
      .click("#createBtn")
      .waitForElementVisible("#errorlog", 5000)
      .assert.containsText("#errorlog", "Subject cannot be empty");
  },
  "Terms of Service should be accepted": function(client) {
    client
      .setValue("#subject", "nightwatch")
      .click('#agreeToS') // Uncheck the checkbox
      .click('#createBtn')
      .waitForElementVisible("#errorlog", 5000)
      .assert.containsText("#errorlog", "You must agree our Terms of Service and Privacy Policy.");
  },
  "Create a new tipbox with PGP" : function (client) {
    client
      .click('#agreeToS') // Check the checkbox
      .click("#createBtn")
      .waitForElementVisible("#tipboxCreated", 5000)
      .assert.containsText("#tipboxCreated", "Your tipbox has been created")
      .end();
  }
};
