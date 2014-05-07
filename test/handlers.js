/* jshint expr: true */
/* global before, after, beforeEach, afterEach */

'use strict';

var _ = require('lodash');
var q = require('q');
var app = require('../app');
var db = require('../db');
var routes = require('../routes');
var util = require('util');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));

describe('handlers', function() {
  describe('index', function() {
    it('renders index', function(done) {
      var req = {};
      var res = {};
      var verify = function() {
        expect(res.render).to.have.been.calledOnce;
        expect(res.render.getCall(0).args[0]).to.equal('index');
        done();
      };
      res.render = sinon.spy(verify);
      routes.index(req, res);
    });
  });

  describe('people module', function() {
    var fixtures = [
      { id: 1, firstName: 'Whitney', lastName: 'Young', address: 'Portland' },
      { id: 2, firstName: 'John', lastName: 'Doe', address: 'New York' }
    ];
    beforeEach(function() {
      sinon.stub(db, 'save', function(collection, id, obj) { return q(obj); });
      sinon.stub(db, 'remove').returns(q(true));
      sinon.stub(db, 'get').returns(q(fixtures[0]));
      sinon.stub(db, 'find').returns(q(fixtures[1]));
      sinon.stub(db, 'findAll').returns(q(fixtures));
      sinon.stub(db, 'createId').returns(3);
    });
    afterEach(function() {
      db.save.restore();
      db.remove.restore();
      db.get.restore();
      db.find.restore();
      db.findAll.restore();
      db.createId.restore();
    });

    describe('list function', function() {
      it('returns an array', function(done) {
        var req = {};
        var res = {};
        var verify = function() {
          expect(res.json).to.have.been.calledOnce;
          expect(res.json.getCall(0).args[0]).to.deep.equal(fixtures);
          done();
        };
        res.json = sinon.spy(verify);
        routes.people.list(req, res);
      });
    });

    describe('create function', function() {
      it('returns the created object', function(done) {
        var body = {
          firstName: 'Johny',
          lastName: 'Sullivan',
          address: 'Baltimore'
        };
        var req = { body:  body };
        var res = {};
        var verify = function() {
          var obj = res.json.getCall(0).args[0];
          expect(res.json).to.have.been.calledOnce;
          expect(db.save).to.have.been.calledWith('people', 3, obj);
          expect(obj).to.deep.equal(_.extend({}, body, { id: 3 }));
          done();
        };
        res.json = sinon.spy(verify);
        routes.people.create(req, res);
      });

      it('requires body', function(done) {
        var req = {};
        var res = {};
        var verify = function() {
          expect(res.json).to.have.been.calledOnce;
          expect(res.json.getCall(0).args[0]).to.equal(404);
          done();
        };
        res.json = sinon.spy(verify);
        routes.people.create(req, res);
      });

      it('requires firstName in body', function(done) {
        var body = {
          lastName: 'Sullivan',
          address: 'Baltimore'
        };
        var req = { body:  body };
        var res = {};
        var verify = function() {
          expect(res.json).to.have.been.calledOnce;
          expect(res.json.getCall(0).args[0]).to.equal(404);
          done();
        };
        res.json = sinon.spy(verify);
        routes.people.create(req, res);
      });

      it('requires lastName in body', function(done) {
        var body = {
          firstName: 'Johny',
          address: 'Baltimore'
        };
        var req = { body:  body };
        var res = {};
        var verify = function() {
          expect(res.json).to.have.been.calledOnce;
          expect(res.json.getCall(0).args[0]).to.equal(404);
          done();
        };
        res.json = sinon.spy(verify);
        routes.people.create(req, res);
      });

      it('requires address in body', function(done) {
        var body = {
          firstName: 'Johny',
          lastName: 'Sullivan'
        };
        var req = { body:  body };
        var res = {};
        var verify = function() {
          expect(res.json).to.have.been.calledOnce;
          expect(res.json.getCall(0).args[0]).to.equal(404);
          done();
        };
        res.json = sinon.spy(verify);
        routes.people.create(req, res);
      });
    });

    describe('read function', function() {
      it('is pending');
    });

    describe('update function', function() {
      it('is pending');
    });

    describe('destroy function', function() {
      it('is pending');
    });
  });
});
