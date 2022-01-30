const jwt = require('express-jwt')
const keys = require('../config/keys.json')
const secret = keys["jwt-key"]
const roles = ["user", "admin", "moderator", "service_user"]
module.exports = function authorize(requiredRole){
    return [
        jwt({secret, algorithms: ['HS256']}),
        (req, res, next) => {
        for(let i = 0; i < req.user.roles.length; i++){
            if(roles.includes(req.user.roles[i]) && requiredRole === req.user.roles[i]){
                next();
            }
        }
        return res.status(501)
        }
    ]
}
