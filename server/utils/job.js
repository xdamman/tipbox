var async = require('async');

var Job = function(fn, data) {

  this.data = data;
  this.fn = fn;

  this.run = function(cb) {
    cb = cb || function() {};
    this.fn(this.data, cb);
  };

};

var Queue = function() {

  var self = this;

  this.lastId = 0;

  this.length = 0;

  this.queue = {};

  this.run = function(id, fn) {
    this.queue[id].run(fn);
    delete this.queue[id];
    this.length--;
    console.log("jobs> Job id "+id+" executed and removed from the queue. Queue length: "+this.length);
  };

  this.add = function(job, delay) {
    var id = this.lastId + 1;
    this.queue[id] = job;
    this.length++;
    this.lastId = id;

    console.log("jobs> Adding a new job (id: "+id+"). Total jobs: ", this.length);

    var delay = delay || 1000*15;
    setTimeout(function(id) {
      self.run(id);
    }, delay, id);

    return id;
  };

  this.getQueueArray = function() {
    var ar = [];
    for(var i in this.queue) {
      ar.push(this.queue[i]);
    }
    return ar;
  };

  this.runAll = function(fn) {
    console.log("jobs> Processing "+this.length+" jobs in parallel");
    async.each(self.getQueueArray(), function(job, done) {
      job.run(done); 
    }, function(err) {
      if(!err) {
        self.queue = [];
      }
      fn(err);
    });
  };

};

module.exports.Job = Job;
module.exports.Queue = Queue; 
