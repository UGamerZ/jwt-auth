const Pool = require('pg-pool');
const pool = new Pool({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "auth"
});

module.exports = pool;