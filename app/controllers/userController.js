const db = require("../models")
const User = db.users
const Op = db.sequelize.Op
const { v4: uuidv4 } = require('uuid');
const {encryptData} = require("./encryptionController")
const bcrypt = require("bcrypt");

exports.create = (req, res) => {
    let data = req.body.data
    if (!data.name || !data.password || !data.surname || !data.username
        || !data.email || !data.roles) {
        res.status(400).send({
            message: "missing parameters!"
        })
        return
    }
    bcrypt.hash(data.password, 10).then(hash => {
        const user = {
            id: uuidv4(),
            username: data.username,
            email: data.email,
            password: hash,
            name: data.name,
            surname: data.surname,
            roles: data.roles
        }

        User.create(user)
            .then(data => {
                data.role = null
                data.password = null
                res.send(data)
            })
            .catch(err => {
                res.status(500).send({
                    message: "500 - Error creating user!"
                })
            })


    })
}

exports.getOne = (req, res) => {

}