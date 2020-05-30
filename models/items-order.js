const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ItemsOrder = sequelize.define('itemsOrder', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,
});

module.exports = ItemsOrder;
