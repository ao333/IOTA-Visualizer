let assert = require('assert');
let expect = require('chai').expect;
let iota = require('../otherjs/get_tips.js');
const IOTA = require('iota.lib.js');
let addAlltips = require('../otherjs/query_interval.js').addAlltips;
let query_tip = require('../otherjs/query_interval.js').query_tip;

describe('Test if launching a new instance of the IOTA object', function(){
  it('should be an instance of IOTA object', function(){
      assert.equal(typeof iota, 'object');
  });
});
describe('Test if function addAlltips()', function(){
  it('should have trunked the tips properties', function(){
      iota.api.getTips(function(error, tips) {
      var tip = tips[0];
      iota.api.getTransactionsObjects([tip], function(error, objects) {
        let result = addAlltips([tip]);
        expect(result).to.have.own.property('this_hash');
        expect(result).to.have.own.property('trunkTransaction');
        expect(result).to.have.own.property('branchTransaction');
        expect(result).to.have.own.property('type');
        expect(result).to.have.own.property('value');
        expect(result).not.own.property('address');
        expect(result).not.own.property('obsoleteTag');
        expect(result).not.own.property('lastIndex');
        expect(result).not.own.property('nonce');
      });
    });
  });
});

describe('Test if function query_tip()', function(){
  it('should be get tips that length >0 and < 41', function(){
      let length = -1;
      query_tip(function(length){
        expect(remaining_tips).to.have.lengthOf.below(41);
        expect(remaining_tips).to.have.lengthOf.at.least(1);
      });
  });
});
