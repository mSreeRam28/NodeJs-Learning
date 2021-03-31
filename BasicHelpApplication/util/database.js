const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nodelearningdb', 'root', 'root', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;