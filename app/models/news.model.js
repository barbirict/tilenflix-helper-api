const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define("news", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING
        },
        creator_id: {
            type: DataTypes.STRING
        },
        text: {
            type: DataTypes.DATE
        },
        date_published: {
            type: DataTypes.DATE
        }
    })

    return Incident
}