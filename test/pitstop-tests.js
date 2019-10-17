const sinon = require("sinon");
const { Pool } = require("pg");
const config = require("../config.js");
const ConnectionManager = require("../ConnectionManager.js");
const pitstop = require("../pitstop.js")._test;

const handleStub = function(obj, funcName, callback) {
  const stub = sinon.stub(obj, funcName);
  const result = callback(stub);
  stub.restore();
  return result;
};

// ********************************************************************************************
// test methods

function createPoolWithDbName(dbName) {
  const pool = new Pool();
  const poolStub = sinon.stub(pool);
  const connection = new ConnectionManager();
  const mockedPool = handleStub(connection, "createPool", stub => {
    if (Object.keys(config.databases).includes(dbName)) {
      stub.withArgs(dbName).returns(poolStub);
    } else {
      stub.withArgs(dbName).throws();
    }
    return connection.createPool(dbName);
  });
  return mockedPool == poolStub;
}

function validateAccessCodeAndName(accessCode, name) {
  const reqObj = { params: { accessCode: accessCode, id: 1, name: name } };
  return pitstop.validate(reqObj);
}

exports._test = {
  createPoolWithDbName: createPoolWithDbName,
  validateAccessCodeAndName: validateAccessCodeAndName
};
