var fs = require('fs');

module.exports = {
  incrCounter: function(c) {
      // Increase the specified counter
      var counterFile = __dirname + '/../../data/' + c + '.cnt';
      var tbCounter = 0 
      if (fs.existsSync(counterFile)) {
          tbCounter = parseInt(fs.readFileSync(counterFile, "utf8"));
          if (isNaN(tbCounter)) {
              tbCounter = 0;
          }
      }
      tbCounter++;
      fs.writeFileSync(counterFile, tbCounter.toString(), {'flags': 'w+'})
      return tbCounter;
  },
  getCounter: function(c) {
      var counterFile = __dirname + '/../../data/' + c + '.cnt';
      var tbCounter = 0 
      if (fs.existsSync(counterFile)) {
          tbCounter = parseInt(fs.readFileSync(counterFile, "utf8"));
          if (isNaN(tbCounter)) {
              tbCounter = 0;
          }
      }
      return tbCounter;
  }

};
