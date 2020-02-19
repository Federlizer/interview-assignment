const fs = require('fs').promises;

function writeData(filename, data) {
  return fs.appendFile(filename, data);
}

/**
 * Executes the query passed and saves the data returned to a filename
 * The results are buffered
 */
module.exports = function backupData(selectQuery, connection, filename) {
  return new Promise((resolve, reject) => {
    const query = connection.query(selectQuery);
    let fieldNames;
    let rowCount = 0;
    let dataToBeWritten = '';

    query.on('error', (err) => reject(err));
    query.on('end', () => {
      if (dataToBeWritten.length > 0) {
        writeData(filename, dataToBeWritten)
          .then(() => resolve())
          .catch((err) => reject(err));
      }
      resolve();
    });

    query.on('fields', (fields) => {
      fieldNames = fields.map((field) => field.name);
      dataToBeWritten = `${fieldNames.join(',')}\n`;
    });

    query.on('result', (result) => {
      const data = fieldNames.map((field) => result[field].toString());
      dataToBeWritten += `${data.join(',')}\n`;
      rowCount += 1;

      // only process 50 rows at a time
      if (rowCount >= 50) {
        connection.pause();

        writeData(filename, dataToBeWritten)
          .then(() => {
            rowCount = 0;
            dataToBeWritten = '';
            connection.resume();
          })
          .catch((err) => reject(err));
      }
    });
  });
};
