const jwt = require('express-jwt')
const keys = require('../config/keys.json')
const secret = keys["jwt-key"]
const roles = ["user", "admin", "moderator", "service_user"]
module.exports = authorize;
    function authorize(requiredRole){
        let ok = false
    return [
        jwt({secret, algorithms: ['HS256'], getToken: function hedr(req){
                return req.headers.authorization
            }}),
        (req, res, next) => {

            let uroles = JSON.parse(req.user.roles)
            console.log("in da hood" + uroles)
            if(uroles[0] === "Admin"){
                ok = true
                next();
            }
        for(let i = 0; i < uroles.length; i++){
            if(roles.includes(uroles[i]) && requiredRole === uroles[i]){
                ok = true
                next();
            }
        }
            if(!ok) res.status(401).send()
        }
    ]
}
