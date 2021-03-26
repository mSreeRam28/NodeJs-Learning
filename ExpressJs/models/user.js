const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
    resetToken: Sequelize.STRING,
    resetTokenExpiration: Sequelize.DATE
}, { timestamps: false });

module.exports = User;