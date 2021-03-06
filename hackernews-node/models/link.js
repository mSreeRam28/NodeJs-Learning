const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Link = sequelize.define('link', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {timestamps: true});

module.exports = Link;