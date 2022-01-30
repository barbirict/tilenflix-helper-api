const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Blacklist = sequelize.define("jbl", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        _jw: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE
        }

    })

    return Blacklist
}