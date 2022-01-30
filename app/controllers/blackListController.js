const db = require("../models")
const Blacklist = db.blacklist
const Op = db.sequelize.Op
const { v4: uuidv4 } = require('uuid');
const bcrpyt = require("bcrypt");

exports.add = (jw) => {
    const bl = {
        id: uuidv4(),
        _jw: jw,
        date: Date.now()
    }
    Blacklist.create(bl)
        .catch(err => {
            console.log("BLACKLIST ADD ERROR: " + err)
        })
}

exports.check = (data) => {
    const _jw = data
    let condition = _jw ? { _jw: { [Op.like]: `%${_jw}%` }} : null

    Blacklist.findOne({where: condition})
        .then(data => {
            return true
        })
    return false
}