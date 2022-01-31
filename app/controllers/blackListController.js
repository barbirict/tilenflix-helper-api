const db = require("../models")
const Blacklist = db.blacklist
const Op = db.Sequelize.Op
const { v4: uuidv4 } = require('uuid');

exports.add = async (jw) => {
    const bl = {
        id: uuidv4(),
        _jw: jw,
        date: Date.now()
    }
    if (!await this.check(jw)){
       return await Blacklist.create(bl)
            .then(data => {
                return true
            })
            .catch(err => {
                console.log("BLACKLIST ADD ERROR: " + err)
                return false
            })
    }
}

exports.check = async (toBlacklist) => {
    const _jw = toBlacklist
    let condition = _jw ? {_jw: {[Op.like]: `%${_jw}%`}} : null
   return await Blacklist.findOne({where: condition})
        .then(data => {
            return !!data
        })
        .catch(err => {
            console.log("err ", err)
            return true
        })
}
