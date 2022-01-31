const db = require("../models")
const Blacklist = db.blacklist
const Op = db.Sequelize.Op
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

exports.check = async (toBlacklist) => {
    const _jw = toBlacklist
    let condition = _jw ? {_jw: {[Op.like]: `%${_jw}%`}} : null
   return await Blacklist.findOne({where: condition})
        .then(data => {
            console.log("data: ", !!data)
            return !!data
        })
        .catch(err => {
            console.log("err ", err)
            return true
        })
}
