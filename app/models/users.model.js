const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        surname: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        roles: {
            type: DataTypes.STRING
        }

    })

    return User
}