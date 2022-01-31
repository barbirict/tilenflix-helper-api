const jwt = require('express-jwt')
const keys = require('../config/keys.json')
const secret = keys["jwt-key"]
const roles = ["User", "Admin", "Moderator", "Service_user"]
const Blacklist = require("../controllers/blackListController")
const {ifExistsId} = require("../helpers/ifExists")
module.exports = authorize;

function authorize(requiredRole) {
    let ok = false
    return [
        jwt({
            secret, algorithms: ['HS256'], getToken: function hedr(req) {
                return req.headers.authorization
            }
        }),
        (req, res, next) => {
            console.log(req.headers.authorization)
            Blacklist.check(req.headers.authorization)
                .then(data => {
                    if (!data) {
                        ifExistsId(req.user.id)
                            .then(exists => {
                                if(exists){
                                let uroles = JSON.parse(req.user.roles)
                                if (uroles[0] === "Admin") {
                                    ok = true
                                    next();
                                } else {
                                    for (let i = 0; i < uroles.length; i++) {
                                        if (roles.includes(uroles[i]) && requiredRole === uroles[i]) {
                                            ok = true
                                            next();
                                        }
                                    }
                                    if (!ok) {
                                        res.status(401).send()
                                    }
                                }
                                }
                                else res.status(401).send()
                            })
                    } else {
                        res.status(401).send()
                    }
                })
        }
    ]
}
