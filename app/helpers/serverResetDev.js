const {cleanReturn} = require("./cleanReturn");
const {ifExists} = require("../helpers/ifExists")
const db = require("../models")
const User = db.users
const Op = db.sequelize.Op
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");

exports.createRootDEV = async function (){
    const role = ["Admin"]
    return await bcrypt.hash("root", 10).then(async hash => {
        const user = {
            id: uuidv4(),
            username: "root",
            email: "root",
            password: hash,
            name: "root",
            surname: "root",
            roles: JSON.stringify(role)
        }
        console.log(user)
        User.create(user)
            .then(data => {
                console.log("root created:\n"+cleanReturn(data),"\nRemember this is only for development\nNot for production!")
            })
            .catch(err => {
                console.log("Error creating user!\n",err)
            })
})
}
exports.cleanStart = async function (){
    return await db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    })

}