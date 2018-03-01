assert = require('assert');
Tools = require('../otherjs/tools.js')
deleteDuplicates = Tools.deleteDuplicates;
getobj = Tools.getobj

describe('Test deleteDuplicates() function', function(){

  it('should hava a function deleteDuplicates', function(){
      assert.equal(typeof deleteDuplicates, 'function');
    });
  it('should return [{"this_hash":"1"}]', function(){
      let input = [{"this_hash":"1"},{"this_hash":"1"},{"this_hash":"1"}];
      assert.deepEqual(deleteDuplicates(input), [{"this_hash":"1"}]);
    });
    let test_input = [{"this_hash":"1"},{"this_hash":"2"},{"this_hash":"3"}];
  it('should return [{"this_hash":"1"},{"this_hash":"2"},{"this_hash":"3"}]', function(){
      assert.deepEqual(deleteDuplicates(test_input), test_input);
    });

  it('should return [{"this_·hash":"1"},{"this_hash":"2"}]', function(){
      assert.deepEqual(deleteDuplicates([{"this_hash":"1"},{"this_hash":"1"},{"this_hash":"2"},{"this_hash":"1"}]), [{"this_hash":"1"},{"this_hash":"2"}]);
    });
 // error test if the result does not contain the this hash value
});
describe('Test getobj function', function(){
  it('should hava a function getobj', function(){
   assert.equal(typeof getobj, 'function');
    });
  it('should return obj: {\'this_hash\':1,\'trunkTransaction\':2,\'branchTransaction\':3,\'type\':\'Tip\',\'value\':0}', function(){
      let obj = {'this_hash':1,'trunkTransaction':2,'branchTransaction':3,'type':'Tip','value':0};
      assert.deepEqual(getobj(1,2,3,'Tip',0), obj);
  });

});
