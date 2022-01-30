const db = require ("../models")
const bcrpyt = require("bcrypt");
const User = db.users
const Op = db.Sequelize.Op
const Blacklist = require("../controllers/blackListController")
const keys = require("../config/keys.json");
const jwt = require("express-jwt");
const jwtS = require('jsonwebtoken');

const secret = keys["jwt-key"]

exports.login = (req, res) => {
    const email = req.query.email
    const password = req.query.password
    let condition = email ? { email: { [Op.like]: `%${email}%` }} : null

    User.findOne({where: condition})
        .then(data => {
        bcrpyt.compare(password, data.password)
            .then(result => {
                if(result){
                    data.password = null
                    data.token = jwtS.sign({id: data.id, roles: data.roles}, secret, "", "")
                    res.send(data)
                }
                res.status(501).send()
            })
        })
    res.status(501).send()
}

exports.logout = (req) => {
 const toBlacklist = req.headers.authorization
    Blacklist.add(toBlacklist)
}

exports.auth = (req, res) => {
    const toBlacklist = req.headers.authorization
    if(!Blacklist.check(toBlacklist)){
        jwt({secret, algorithms: ['HS256']}),
            function (req, res){
            User.findByPk(req.user.id)
                .then(data => {
                    data.password = null
                    res.send(data)
                })
            }
    }
    res.status(501).send()

}

exports.reset = (req, res) => {

}