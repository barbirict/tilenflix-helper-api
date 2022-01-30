const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Incident = sequelize.define("incident", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        reporter_id: {
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

    return Incident
}