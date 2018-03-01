const mongoose = require('mongoose');
let expect = require('chai').expect;
mongoose.Promise = require('bluebird');
const config = require('../config.js');

let iota = require('../otherjs/get_tips.js');
const IOTA = require('iota.lib.js');
let query_tip = require('../otherjs/query_interval.js').query_tip;
let create_father = require('../otherjs/query_interval.js').create_father;

let Iota_schema = require('../models/iotaes.js').iota_data;
let IOTA_coll = mongoose.model('IOTA_coll', Iota_schema);
let Statistics_schema = require('../models/statistics.js').statistics;
let Statistics_coll = mongoose.model('Statistics_coll', Statistics_schema);
let Track_schema = require('../models/track.js').track;
let Track_coll = mongoose.model('Track_coll', Track_schema);
let Stat = require('../models/Stat.js').stat;
let Stat_coll = mongoose.model('Stat_coll', Stat);


describe('IOTAES Schema', function() {
  // test required
  var m = new IOTA_coll();
  it('should be invalid if this_hash, type or value is empty', function(done) {
    m.validate(function(err) {
      expect(err.errors.this_hash).to.exist;
      expect(err.errors.type).to.exist;
      expect(err.errors.value).to.exist;
      done();
    });
  });
});

describe('Database Tests', function() {
  //Before starting the test, create a sandboxed database connection
  //Once a connection is established invoke done()
  before(function(done) {
    const url = config.mongoUrl;
    mongoose.connect(url, {
      auth: {
        user: config.user,
        password: config.password
      },
      keepAlive: 120
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      done();
    });
  });

  describe('Test Database for Iota', function() {
    let data = {
      this_hash: "1234",
      trunkTransaction: "1234",
      branchTransaction: "1234",
      type: "tip",
      value: "1234"
    };
    //Save object to db
    describe('Test function create_father()', function() {
      it('Should retrieve data from that just query from iota api', function() {
        this.timeout(10000);
        iota.api.getTips(function(error, tips) {
          var tip = tips[0];
          iota.api.getTransactionsObjects([tip], function(error, objects) {
            create_father(IOTA_coll, objects, [], function() {
              //Look up the 'Mike' object previously saved.
              IOTA_coll.find({}, (err, name) => {
                if (err) {
                  throw err;
                }
                if (name.length === 0) {
                  throw new Error('No data!');
                }
                done();
              });
            });
          });
        })
      });
    });

    it('New stat saved to database', function(done) {
      var testStat = IOTA_coll(data);
      testStat.save(done);
    });

    it('Should retrieve data from test database', function(done) {
      //Look up the 'Mike' object previously saved.
      IOTA_coll.find(data, (err, name) => {
        if (err) {
          throw err;
        }
        if (name.length === 0) {
          throw new Error('No data!');
        }
        done();
      });
    });

  });

  describe('Test Database for statistics', function() {
    let data = {
      TotalTips: 11,
      MeanConTime: 11,
      ValuePerSec: 11
    };
    //Save object to db
    it('New stat saved to database', function(done) {
      var testStat = Statistics_coll(data);
      testStat.save(done);
    });
    it('Should retrieve data from test database', function(done) {
      //Look up the 'Mike' object previously saved.
      Statistics_coll.find(data, (err, name) => {
        if (err) {
          throw err;
        }
        if (name.length === 0) {
          throw new Error('No data!');
        }
        done();
      });
    });
  });

  describe('Test Database for Track', function() {
    let data = {
      oldValue: [1, 2, 3],
      updateValue: [2, 3, 4]
    };
    //Save object to db
    it('New stat saved to database', function(done) {
      var testStat = Track_coll(data);
      testStat.save(done);
    });

    it('Should retrieve data from test database', function(done) {
      Track_coll.find(data, (err, name) => {
        if (err) {
          throw err;
        }
        if (name.length === 0) {
          throw new Error('No data!');
        }
        done();
      });
    });
  });
  describe('Test Database for stat', function() {
    //Save object to db
    it('New stat saved to database', function(done) {
      var testStat = Stat_coll({
        notFinished: [1, 2],
        Finished: [3, 4]
      });
      testStat.save(done);
    });

    it('Should retrieve data from test database', function(done) {
      //Look up the 'Mike' object previously saved.
      Stat_coll.find({
        notFinished: [1, 2],
        Finished: [3, 4]
      }, (err, name) => {
        if (err) {
          throw err;
        }
        if (name.length === 0) {
          throw new Error('No data!');
        }
        done();
      });
    });
  });
  // After all tests are finished drop database and close connection
  after(function(done) {
    IOTA_coll.remove({}, function() {
      Statistics_coll.remove({}, function() {
        Track_coll.remove({}, function() {
          Stat_coll.remove({}, function() {
            mongoose.connection.close(done);
          });
        });
      });
    });
  });
});
