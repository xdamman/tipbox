var pgpsearch = require('node-pgp-search');
var memoryCache = {};

// We clear the memory cache every day
setInterval(function() {
  memoryCache = {};
}, 1000*60*60*24);

module.exports = function(app) {
  return {

    index: function(req, res, next) {
      var email = req.param('email');
      if(memoryCache['index/'+email]) return res.send(memoryCache['index/'+email]);
      /* search keys with exact match */
      pgpsearch.index(email, function(err, keys) {
        if(err) return res.send(err);
        var fkeys = [];
	for (i = 0; i < keys.length; ++i) {
	  /* filter out revoked keys */
	  if (keys[i].flags && keys[i].flags.match(/r/))
	    continue;
	  fkeys.push(keys[i]);
	}
        if(app.set('env') !== 'production') memoryCache['index/'+email] = { keys: fkeys };
        res.send({keys: keys});
      }, true);
    },

    get: function(req, res, next) {
      var fingerprint = req.body.fingerprint;
      if(memoryCache['get/'+fingerprint]) return res.send(memoryCache['get/'+fingerprint]);
      pgpsearch.get(fingerprint, function(err, key) {
        if(err) return res.send(err);
        memoryCache['get/'+fingerprint] = {public_key:key};
        res.send({public_key: key});
      });

    }

  }
};
