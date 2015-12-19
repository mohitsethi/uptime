/**
 * Module dependencies.
 */
var express    = require('express');
var Check      = require('../../models/check');
var CheckEvent = require('../../models/checkEvent');

var app = module.exports = express();

var debugErrorHandler = function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// middleware
app.configure(function(){
  app.use(app.router);
});

app.configure('development', debugErrorHandler);

app.configure('test', debugErrorHandler);

app.configure('production', function(){
  app.use(express.errorHandler());
});


// up count
var upCount;
var refreshUpCount = function(callback) {
  var count = { up: 0, down: 0, paused: 0, total: 0 };
  Check
  .find()
  .select({ isUp: 1, isPaused: 1 })
  .exec(function(err, checks) {
    if (err) return callback(err);
    checks.forEach(function(check) {
      count.total++;
      if (check.isPaused) {
        count.paused++;
      } else if (check.isUp) {
        count.up++;
      } else {
        count.down++;
      }
    });
    upCount = count;
    callback();
  });
};

Check.on('afterInsert', function() { upCount = undefined; });
Check.on('afterRemove', function() { upCount = undefined; });
Check.on('afterDelete', function() { upCount = undefined; });

CheckEvent.on('afterInsert', function() { upCount = undefined; });

app.get('/checks/count', function(req, res, next) {
  if (upCount) {
    res.json(upCount);
  } else {
    refreshUpCount(function(err) {
      if (err) return next(err);
      res.json(upCount);
    });
  }
});

// Routes

require('./routes/check')(app);
require('./routes/tag')(app);
require('./routes/ping')(app);

// route list
app.get('/', function(req, res) {
  var routes = [];
  for (var verb in app.routes) {
    app.routes[verb].forEach(function(route) {
      routes.push({method: verb.toUpperCase() , path: app.route + route.path});
    });
  }
  res.json(routes);
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

MTS-1 (Level P1)
MTS-2 (Level P2)
MTS-3 (Level P3) 
Sr MTS (Level P4)
Staff Engineer (Level P5)
Sr Staff Engineer (Level P6)
Principal Engineer (Level P7)
ON THE IC TRACK

Manager (Level M3 equivalent to P4)
Sr Manager (Level M4 equivalent to P5)
Director (Level M5 equivalent to P6)
Sr Director (Level M6 equivalent to P7)
