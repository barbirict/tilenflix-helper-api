const db = require ("../models")
const bcrpyt = require("bcrypt");
const User = db.users
const Op = db.Sequelize.Op
const Blacklist = require("../controllers/blackListController")
const keys = require("../config/keys.json");
const jwt = require("express-jwt");
const jwtS = require('jsonwebtoken');
const secret = keys["jwt-key"]
const {cleanReturn} = require("../helpers/cleanReturn")

exports.login = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    console.log(email, " ", password)
    let condition = email ? { email: { [Op.like]: `%${email}%` }} : null

    User.findOne({where: condition})
        .then(data => {
            if(data) {
                bcrpyt.compare(password, data.password)
                    .then(result => {
                        if (result) {
                            let toReturn = {
                                data: null,
                                token: null
                            }
                            let token = jwtS.sign({id: data.id, roles: data.roles}, secret, {expiresIn: '1d'})
                            toReturn.data = cleanReturn(data)
                            toReturn.token = token
                            res.send(toReturn)
                        }
                        else res.status(400).send()
                    })
            }
            else res.status(400).send()
        })
}

exports.logout = (req, res) => {
 const toBlacklist = req.headers.authorization
    Blacklist.add(toBlacklist).then(r => {
        if(r) {
            res.status(200).send()
        }
        else res.status(400).send()
    })
        .catch(err => {
            console.log(err)
            res.status(400).send()
        })
}

exports.auth =  (req, res) => {
     User.findByPk(req.user.id)
            .then(data => {
                if(data) {
                    data.password = null
                    res.send(cleanReturn(data))
                }
                else res.status(404).send()
            })

}

exports.reset = (req, res) => {

}