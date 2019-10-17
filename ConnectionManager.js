const config = require("./config.js");
const DATABASES = config.databases;
const { Pool } = require("pg");

class ConnectionManager {
  constructor() {
    // keep track of pools created, so as not to re-create them
    // unless explicitly desired.
    this._currentPools = {};
  }
  /**
   * Returns a connection pool for use. This is dependent on the database name provided.
   * If the reEstablishConnection parameter is set to true a new pool will be created,
   * regardless if it already exists.
   * @param {string} dbName
   * @param {boolean} reEstablishConnection
   */
  createPool(dbName, reEstablishConnection = false) {
    const dbObj = DATABASES[dbName];
    if (dbObj == undefined) throw new Error("Unrecognized database.");

    if (this._currentPools[dbName] !== undefined && !reEstablishConnection) {
      return this._currentPools[dbName];
    }

    const pool = new Pool(dbObj);
    this._currentPools[dbName] = pool;
    return pool;
  }

  /**
   * Logs to the database
   * @param {string} data
   */
  async query(data, pool) {
    if (pool == null) throw new Error("Connection Pool Not Established.");

    const client = await pool.connect().catch(err => {
      throw new Error(`Error thrown: ${err};`);
    });

    await client.query(`insert into entry_history values(${data}, ${new Date()})`);
    client.release();
  }

  /**
   * Tells the pool to listen to the specified event
   * and execute the callback with the acquired client
   * @param {string} event
   * @param {Pool} pool
   * @param {Function} callback
   */
  handleEvent(event, pool, callback) {
    pool.on(event, client => {
      callback(client);
    });
  }

  /**
   * Tells the pool listen for errors and return a promise when an error is raised.
   * @param {Pool} pool
   * @param {Function} callback
   */

  handleError(pool) {
    return new Promise((resolve, reject) => {
      pool.on("error", (err, client) => {
        if (err) reject(err, client);
      });
      resolve();
    });
  }

  /**
   * Drains the pool of all active clients and destroys them.
   */
  destroyConnection(pool) {
    pool.end();
  }
}

module.exports = ConnectionManager;
