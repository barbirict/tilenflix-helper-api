const db = require("../models")
const Op = db.Sequelize.Op
const User = db.users
exports.ifExists = async function(username, email) {
    let condU = username ? {username: {[Op.like]: `%${username}%`}} : null
    let condE = email ? {email: {[Op.like]: `%${email}%`}} : null
    let uExist = false
    let eExist = false
    await User.findOne({where: condU})
        .then(data => {
            if(data) uExist = true
        })
    await User.findOne({where: condE})
        .then(data => {
            if(data) eExist = true
        })
    return uExist && eExist
}
exports.ifExistsId = async function(id){
    let condition = id ? {id: {[Op.like]: `%${id}%`}} : null
    let uExist = false
    await User.findOne({where: condition})
        .then(data => {
            if(data) uExist = true
        })
    return uExist
}