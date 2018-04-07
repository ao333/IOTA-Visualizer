getInitialDataToShow = require('../query_iota/helpers/queries.js').getInitialDataToShow
determineState = require('../query_iota/helpers/queries.js').determineState
assert = require('assert')

describe('Test getInitialDataToShow() function', function() {
  it('should hava a function getInitialDataToShow', function() {
    assert.equal(typeof getInitialDataToShow, 'function');
  });
});
describe('Test determineState() function', function() {
  it('should hava a function gdetermineState', function() {
    assert.equal(typeof determineState, 'function');
  });
});
