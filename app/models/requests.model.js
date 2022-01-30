const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define("request", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        requester_id: {
            type: DataTypes.STRING
        },
        item: {
            type: DataTypes.STRING
        },
        date_reported: {
            type: DataTypes.DATE
        },
        date_finished: {
            type: DataTypes.DATE
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