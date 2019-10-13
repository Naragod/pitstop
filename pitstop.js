var db = require("pg");

var testDatabase = {
  user: "user",
  password: "password",
  host: "localhost",
  database: "staging",
  port: 5432
};

var stagingDatabase = {
  user: "user",
  password: "password",
  host: "localhost",
  database: "staging",
  port: 5432
};

var productionDatabase = {
  user: "user",
  password: "password",
  host: "localhost",
  database: "staging",
  port: 5432
};

const DATABASES = {
  local: testDatabase,
  staging: stagingDatabase,
  production: productionDatabase
};

// ********************************************************************************************
// public methods

/**
 * Checks if an individual is allowed to enter.
 * If it is, it logs appropriately to the database
 * and returns true else it throws an error and
 * returns false.
 * @param {json} req
 * @param {json} res
 */
let accessDoor = async function(req, res) {
  let isValid = validate(req);

  try {
    if (!isValid) throw new Error(`${req.params.accessCode} is not the correct access code.`);

    let client = dbClient(process.env.NODE_ENV, DATABASES);
    await logToDb(req.params.id, client);
    res.send("Succesfully logged to db.");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// ********************************************************************************************
// private methods

/**
 * Returns new database client
 * @param {string} dbName
 * @param {Object} databases
 */
let dbClient = function(dbName, databases) {
  let dbObj = databases[dbName];
  if (dbObj == undefined) throw new Error("Unrecognized database");

  return new db.Client(dbObj);
};

/**
 * Validates that user is Joe or has valid access code
 * @param {json} req
 */
let validate = function(req) {
  if (!req.params.id) return false;

  if (req.params.accessCode != "accessCode" && req.params.name != "Joe") return false;

  return true;
};

/**
 * Logs to database
 * @param {string} data
 * @param {Database Client} dbClient
 */
let logToDb = async function(data, dbClient) {
  await dbClient.query(`insert into entry_history values(${data}, ${new Date()})`);
};

// ********************************************************************************************
// test cases

exports._test = {
  validate: validate,
  dbClient: dbClient,
  DATABASES: DATABASES
};

module.exports["accessDoor"] = accessDoor;
