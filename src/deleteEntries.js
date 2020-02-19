const util = require('util');

/**
 * Deletes the passed entries from the database
 * entries should be an array of UUIDs
 */
module.exports = function cleanupDatabase(connection, entries) {
  return new Promise((resolve, reject) => {
    const query = util.promisify(connection.query).bind(connection);

    const sqlQuery = 'delete from users where ';
    const idStatements = entries.map((id) => `id = '${id}'`).join(' or ');

    query(sqlQuery + idStatements)
      .then((results) => {
        resolve(results.affectedRows);
      })
      .catch((err) => reject(err));
  });
};
