const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define("request", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        requester_id: {
            type: DataTypes.STRING
        },
        item: {
            type: DataTypes.STRING
        },
        date_reported: {
            type: DataTypes.STRING
        },
        date_finished: {
            type: DataTypes.STRING,
            allowNull: true
        },
        comments: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING
        }

    })

    return Request
}