var logger = require('../utils/logger').instance()

module.exports = function (app) {
  app.use(function (req, res, next) {
    logger.info('%s %s %s', req.method, req.url, req.path)
    next()
  })
}
