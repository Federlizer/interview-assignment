const util = require('util');
const LineByLine = require('line-by-line');

/**
 * Verifies that the data is saved correctly in the CSV file
 * The verification is done one row at a time to allow for large data sets
 */
module.exports = function verifyData(connection, filename) {
  return new Promise((resolve, reject) => {
    const query = util.promisify(connection.query).bind(connection);
    const lineReader = new LineByLine(filename);
    let verifiedEntries = [];
    let firstLine = true;

    lineReader.on('line', (line) => {
      lineReader.pause();

      if (firstLine) {
        // skip first line since it doesn't hold actual data
        firstLine = false;
        lineReader.resume();
        return;
      }

      const columns = line.split(',');
      const user = {
        id: columns[0],
        firstName: columns[1],
        lastName: columns[2],
        email: columns[3],
      };

      query('select * from users where id=?', user.id)
        .then((results) => {
          const dbuser = results[0];

          if (
            user.id !== dbuser.id
            || user.firstName !== dbuser.firstName
            || user.lastName !== dbuser.lastName
            || user.email !== dbuser.email
          ) {
            reject(new Error('Data hasn\'t been saved correctly'));
          } else {
            verifiedEntries = [...verifiedEntries, user.id];

            lineReader.resume();
          }
        })
        .catch((err) => reject(err));
    });

    lineReader.on('end', () => {
      resolve(verifiedEntries);
    });
  });
};
