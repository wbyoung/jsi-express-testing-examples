'use strict';

var express = require('express');
var routes = require('./routes');
var path = require('path');

var create = exports.create = function() {
  var app = express();

  app.set('view engine', 'hbs');
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', routes.index);

  app.route('/api/people')
  .get(routes.people.list)
  .post(routes.people.create);

  app.route('/api/people/:id')
  .get(routes.people.read)
  .put(routes.people.update)
  .delete(routes.people.destroy);

  return app;
};

if (require.main === module) {
  var env = process.env.NODE_ENV || 'development';
  var port = process.env.PORT || 3000;
  create().listen(port, function() {
    console.log('Express server started on port %s', port);
  });
}
