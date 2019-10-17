const config = require("./config.js");
const ConnectionManager = require("./ConnectionManager.js");

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
const accessDoor = async function(req, res) {
  const isValid = validate(req);
  const connection = new ConnectionManager();

  try {
    if (!isValid) throw new Error(`${req.params.accessCode} is not the correct access code.`);

    const pool = connection.createPool(process.env.NOVE_ENV);
    await connection.handleError(pool).catch((err, client) => {
      throw new Error(`Client: ${client}, erred: ${err}`);
    });

    await connection.query(req.params.id, pool);
    res.send("Succesfully logged to db.");
    connection.end(pool);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// ********************************************************************************************
// private methods

/**
 * Validates that user has the allowed name or has a valid access code
 * @param {json} req
 */
const validate = function(req) {
  if (!req.params.id) return false;

  if (req.params.accessCode !== config.accessCode && req.params.name !== config.allowedName) return false;

  return true;
};

exports._test = {
  validate: validate
};

module.exports["accessDoor"] = accessDoor;
