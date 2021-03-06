// const mysql = require('mysql');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'nodelearningdb'
// });

// module.exports = pool.promise();

const { Sequelize } = require('sequelize');

const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {dialect: 'mysql', host: process.env.MYSQL_HOST, port: process.env.MYSQL_PORT});

module.exports = sequelize;