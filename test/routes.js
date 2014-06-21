/* jshint expr: true */
/* global before, after */

'use strict';

var app = require('../app');
var routes = require('../routes');
var util = require('util');
var http = require('http');
var request = require('request');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));

var server;
var port = 383273;
var baseURL = util.format('http://localhost:%d', port);

var spread = function(fn) { return function(args) { fn.apply(null, args); }; };
var spy = spread(sinon.spy);
var restore = spread(function(module, name) { module[name].restore(); });

var spies = [
  [routes, 'index'],
  [routes.people, 'list'],
  [routes.people, 'create'],
  [routes.people, 'read'],
  [routes.people, 'update'],
  [routes.people, 'destroy']
];

describe('routing', function() {
  // install spies before creating the app and starting the server
  beforeEach(function() { spies.forEach(spy); });
  afterEach(function() { spies.forEach(restore); });

  // create the app and start the server
  beforeEach(function(done) { server = app.create().listen(port, done); });
  afterEach(function(done) { server.close(done); });

  describe('GET /', function() {
    it('calls index route', function(done) {
      request.get(baseURL + '/', function(err, res, data) {
        expect(routes.index.callCount).to.eql(1);
        expect(routes.index.getCall(0).args[0].params).to.eql({});
        done();
      });
    });
  });

  describe('GET /api/people', function() {
    it('calls people.list route', function(done) {
      request.get(baseURL + '/api/people', function(err, res, data) {
        expect(routes.people.list.callCount).to.eql(1);
        expect(routes.people.list.getCall(0).args[0].params).to.eql({});
        done();
      });
    });
  });

  describe('POST /api/people', function() {
    it('calls people.create route', function(done) {
      var params = { firstName: 'Whitney', lastName: 'Young', address: 'Portland' };
      var opts = { url: baseURL + '/api/people', json: params };
      request.post(opts, function(err, res, data) {
        expect(routes.people.create.callCount).to.eql(1);
        expect(routes.people.create.getCall(0).args[0].params).to.eql({});
        done();
      });
    });
  });

  describe('GET /api/people/:id', function() {
    it('calls people.read route', function(done) {
      request.get(baseURL + '/api/people/1', function(err, res, data) {
        expect(routes.people.read.callCount).to.eql(1);
        expect(routes.people.read.getCall(0).args[0].params).to.eql({ id: '1' });
        done();
      });
    });
  });

  describe('PUT /api/people/:id', function() {
    it('calls people.update route', function(done) {
      var params = { firstName: 'Whitney', lastName: 'Young', address: 'Portland' };
      var opts = { url: baseURL + '/api/people/1', json: params };
      request.put(opts, function(err, res, data) {
        expect(routes.people.update.callCount).to.eql(1);
        expect(routes.people.update.getCall(0).args[0].params).to.eql({ id: "1" });
        done();
      });
    });

    it.skip('produces error for non-numeric values', function(done) {
      request.put(baseURL + '/api/people/whitney', function(err, res, data) {
        expect(res.statusCode).to.equal(404);
        expect(routes.people.update).to.not.have.been.called;
        done();
      });
    });
  });
});
