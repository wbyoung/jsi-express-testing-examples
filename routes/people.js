'use strict';

var db = require('../db');

exports.list = function(req, res) {
  db.findAll('people')
  .then(res.json.bind(res))
  .done();
};

exports.create = function(req, res) {
  if (!req.body ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.address) { return res.json(404); }

  var person = {
    id: db.createId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address
  };

  db.save('people', person.id, person)
  .then(res.json.bind(res))
  .done();
};

exports.read = function(req, res) {
  res.json({});
};

exports.update = function(req, res) {
  res.json({});
};

exports.destroy = function(req, res) {
  res.json({});
};
