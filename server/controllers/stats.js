var counter = require('../utils/counter')

module.exports = function (app) {
  return {

    get: function (req, res, next) {
      res.send({ tipbox: counter.getCounter('tipbox'), tip: counter.getCounter('tip') })
    }

  }
}
