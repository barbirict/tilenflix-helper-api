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
    })

}

exports.getOne = (req, res) => {

    let uRoles = JSON.parse(req.user.roles)

    let qid = req.params.id
    let uid = req.user.id

    if(!uRoles.includes("Admin") && (uid !== qid)){
        console.log("tu ja")
            res.status(401).send()
    }
    else {
        console.log("qid" + req.query.id)
        console.log("\n\n\nuRoles ", uRoles)
        User.findByPk(qid)
            .then(data => {
                console.log("Datat: " + data)
                if(data) {
                    res.send(cleanReturn(data))
                }
                else res.status(404).send()
            })
            .catch(err => {
                console.log("error getting user! " + err)
            })

    }

}

exports.getAll = (req, res) => {
    User.findAll()
        .then(data => {
           for(let i = 0; i< data.length; i++){
                data[i] = cleanReturn(data[i])
            }
            res.send(data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Error getting users"
            })
        })
}

exports.getAllRoles = (req, res) => {
    let role = req.params.role
    User.findAll()
        .then(data => {
            let returnData = []
            for(let i = 0; i< data.length; i++){
                data[i] = cleanReturn(data[i])
                if(data[i].roles.includes(role)) returnData.push(data[i])
            }
            res.send(returnData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Error getting users"
            })
        })
}

exports.editOne = (req, res) => {
    let toUpdate = req.body
    let id = req.params.id
    toUpdate.roles = JSON.stringify(toUpdate.roles)
    User.update(toUpdate, { where: {id: id}})
        .then(data => {
            if(data.length === 1) {
                res.status(200).send()
            }
            else res.status(500).send()
        })
        .catch(err => {
          console.log(err)
          res.status(500).send()
        })
}

exports.deleteOne = (req, res) => {
    User.destroy({where: {id : req.params.id}})
        .then(data => {
            if(data) res.status(200).send()
            else res.status(500).send()
        })
        .catch(err => {
            console.log("err: ", err)
            res.status(500).send()
        })
}