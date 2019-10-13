let sinon = require("sinon");
let pg = require("pg");
let pitstop = require("../pitstop.js")._test;
let pgMock = sinon.mock(pg);

const dbObj = {
  database: "staging",
  host: "localhost",
  password: "password",
  port: 5432,
  user: "user"
};

let handleMock = function(mock, showError, callback) {
  try {
    callback();
    mock.verify();
  } catch (error) {
    if (showError) console.error("Error thrown:", error);
    return false;
  } finally {
    mock.restore();
  }
  return true;
};

// ********************************************************************************************
// test methods

function createDbClientWithDbName(dbName) {
  pgMock
    .expects("Client")
    .withArgs(dbObj)
    .once();
  return handleMock(pgMock, false, () => {
    pitstop.dbClient(dbName, pitstop.DATABASES);
  });
}

function validateIsJoeAndNoAccessCode() {
  let reqObj = { params: { accessCode: "someCode", id: 1, name: "Joe" } };
  return pitstop.validate(reqObj);
}

function validateIsNotJoeAndAccessCode() {
  let reqObj = { params: { accessCode: "accessCode", id: 1, name: "mateo" } };
  return pitstop.validate(reqObj);
}

function validateIsNotJoeAndNoAccessCode() {
  let reqObj = { params: { accessCode: "someCode", id: 1, name: "mateo" } };
  return pitstop.validate(reqObj);
}

exports._test = {
  createDbClientWithDbName: createDbClientWithDbName,
  validateIsNotJoeAndNoAccessCode: validateIsNotJoeAndNoAccessCode,
  validateIsNotJoeAndAccessCode: validateIsNotJoeAndAccessCode,
  validateIsJoeAndNoAccessCode: validateIsJoeAndNoAccessCode
};
