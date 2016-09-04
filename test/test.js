'use strict';

var expect = require('chai').expect;
var schemaGen = require('../index');
var mongoUrl = 'mongodb://localhost:27017/mongo-schema-gen';



describe('#isConnected() connection not established', function () {
  it('should return false as mongoDB connection has not been established', function () {
    expect(schemaGen.isConnected()).to.be.false;
  });
});


describe('#isConnected() connection established', function () {

  before(function (done) {
    if (!schemaGen.isConnected()) {
      schemaGen.connect(mongoUrl, function (db) {
        done();
      });
    }
  });

  after(function () {
    schemaGen.disconnect();
  });

  it('should return true as mongoDB connection has been established', function () {
    expect(schemaGen.isConnected()).to.be.true;
  });
});



describe('#disconnect()', function () {

  before(function (done) {
    if (!schemaGen.isConnected()) {
      schemaGen.connect(mongoUrl, function (db) {
        done();
      });
    }
  });

  it('should return true for connected check', function () {
    expect(schemaGen.isConnected()).to.be.true;
  });

  it('should return false for connected check', function () {
    schemaGen.disconnect();
    expect(schemaGen.isConnected()).to.be.false;
  });

  it('should return null for connection mongoDB object', function () {
    expect(schemaGen.getDB()).to.be.null;
  });
});


describe('#getKeys() Error', function () {
  it('should throw Error as error occurs', function () {
    expect(schemaGen.getKeys).to.throw(Error);
  });
});


describe('#getKeys()', function () {

  before(function (done) {
    if (!schemaGen.isConnected()) {
      schemaGen.connect(mongoUrl, function (db) {
        var User = db.collection('users');
        User.insertOne({
          name: 'Mustapha Babatunde',
          age: 26,
          job: 'Software Engineer',
          dob: new Date
        });
        done();
      });
    }
  });

  after(function () {
    var db = schemaGen.getDB();
    var User = db.collection('users');
    User.remove({});
    schemaGen.disconnect();
  });

  it('should throw error if collectionName is not passed as argument to getKeys', function () {
    expect(schemaGen.getKeys).to.throw(Error)
  });

  it('should return all keys used in collection as an array of strings', function (done) {
    schemaGen.getKeys('users', function (keys) {
      expect(keys).to.have.lengthOf(5);
      done();
    });
  });

});

