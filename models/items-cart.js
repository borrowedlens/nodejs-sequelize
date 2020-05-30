const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ItemsCart = sequelize.define('itemsCart', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: Sequelize.INTEGER,
});

module.exports = ItemsCart;
