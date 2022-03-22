
const util = require('util');
const fs = require('fs');
const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit: 10,
	connectTimeout  : 60 * 60 * 1000,
	host: 'direct2resort-do-user-8143714-0.b.db.ondigitalocean.com',
	user: 'dtrdbadmin',
	password: 'x57segb387gb3470',
	database: 'dtr-dev-db-01',
	port: 25060,
	ssl: {
		ca : fs.readFileSync(__dirname + '/ca-certificate.crt')
	}
});

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
	console.log(err);
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.');
		}
	}

	if (connection) {
 connection.release();
}

	return;
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

module.exports = pool;
