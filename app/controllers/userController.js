const db = require("../models")
const User = db.users
const Op = db.sequelize.Op
const { v4: uuidv4 } = require('uuid');
const {encryptData} = require("./encryptionController")
const bcrypt = require("bcrypt");
const {cleanReturn} = require("../helpers/cleanReturn")
const {ifExists} = require("../helpers/ifExists")
exports.create = (req, res) => {

    let data = req.body
    if (!data.name || !data.password || !data.surname || !data.username
        || !data.email || !data.roles) {
        res.status(400).send({
            message: "missing parameters!"
        })
        return
    }

    bcrypt.hash(data.password, 10).then(async hash => {
        const user = {
            id: uuidv4(),
            username: data.username,
            email: data.email,
            password: hash,
            name: data.name,
            surname: data.surname,
            roles: JSON.stringify(data.roles)
        }
        console.log(user)
        ifExists(user.username, user.email)
            .then(exists => {
                if(exists) {
                    res.status(500).send({
                        message: "500 - Error creating user!"
                    })
                }
                else {
                    User.create(user)
                        .then(data => {
                            res.send(cleanReturn(data))
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).send({
                                message: "500 - Error creating user!"
                            })
                        })
                }
            })
        /*
        if (!await ifExists(user.username, user.email)) {
            User.create(user)
                .then(data => {
                    res.send(cleanReturn(data))
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).send({
                        message: "500 - Error creating user!"
                    })
                })

        } else {
            console.log("obstaja email al pa username")
            */
            /*res.status(500).send({
                message: "500 - Username or email already in use!"
            })*/
    })

}

exports.getOne = (req, res) => {

}