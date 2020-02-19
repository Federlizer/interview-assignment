# Job interview assignment
A script that accepts an SQL query and executes it. The results from that query are then processed and saved on a file
in the working directory (`dump.csv`). The script then verifies the data integrity and deletes the database entries.

## Usage
The script requires a `config.json` file in the src directory containing the following information:

```json
{
  "db": {
    "host": "db_host_url",
    "user": "db_user",
    "password": "db_user_pw",
    "database": "db_to_use"
  }
}
```

To run the script:

```
$ npm install
$ ./src/index.js <sql query>

# Example:

$ ./src/index.js "select * from users"
```

### Known errors and shortcommings
* The script doesn't do any checks on the sql query, meaning sql injections and some bugs are possible
* In this solution I used the mysql package, however a cleaner solution would have been possible by using a MariaDB package instead
* Solution lacks tests
