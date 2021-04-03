const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('noderestdb', 'root', 'root', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;