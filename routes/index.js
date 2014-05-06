'use strict';

exports.people = require('./people');

exports.index = function(req, res) {
  res.render('index', { title: 'Express Testing Examples' });
};
