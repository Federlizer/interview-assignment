#!/usr/bin/env node
const mysql = require('mysql');

const backupData = require('./backupData.js');
const verifyData = require('./verifyData.js');
const deleteEntries = require('./deleteEntries.js');

const config = require('./config.json');

// grab only relevant arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: ./index.js <sql query>');
  process.exit(1);
}

const selectQuery = args[0];
const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

const filename = 'dump.csv';

connection.connect((connectionErr) => {
  if (connectionErr) throw connectionErr;

  backupData(selectQuery, connection, filename)
    .then(() => verifyData(connection, filename))
    .then((entries) => deleteEntries(connection, entries))
    .then((processedRows) => {
      console.log(`Successfuly processed ${processedRows} rows`);
      connection.end();
    })
    .catch((err) => {
      throw err;
    });
});
