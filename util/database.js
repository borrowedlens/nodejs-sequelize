const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'wengerknows', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;
