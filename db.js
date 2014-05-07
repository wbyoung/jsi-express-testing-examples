'use strict';

var _ = require('lodash');
var q = require('q');
var collections = {}; // all objects are stored in memory rather than using an actual database

var match = function(object, query) {
  return _.every(query, function(value, key) {
    return object[key] === value;
  });
};

var storage = function(name) {
  return (collections[name] || (collections[name] = {}));
};

var promise = function(object) {
  return object ? q(object) : q.reject(new Error('not found'));
};

exports.save = function(collection, id, object) {
  console.log('save obj');
  return promise(storage(collection)[id] = object);
};

exports.remove = function(collection, id) {
  return promise(delete (storage(collection))[id]);
};

exports.get = function(collection, id) {
  return promise(storage(collection)[id]);
};

exports.find = function(collection, query) {
  return promise(_.find(storage(collection), function(object, key) {
    return match(object, query);
  }));
};

exports.findAll = function(collection, query) {
  return promise(_.filter(storage(collection), function(object, key) {
    return match(object, query);
  }));
};

exports.reset = function() {
  return (collections = {}) && q(true);
};

exports.createId = function() {
  var ids = _.reduce(collections, function(arr, collection) {
    return arr.concat(_.map(collection, 'id'));
  }, []);
  var id = _.max(ids);
  return id < 0 ? 0 : id + 1;
};
