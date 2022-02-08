const db = require("../models")
const {cleanReturnRequestsAll} = require("../helpers/cleanReturn");
const {MovieDb} = require("moviedb-promise");
const {ifRequestItemExists} = require("../helpers/ifExists");
const Request = db.requests
const Op = db.Sequelize.Op
const keys = require("../config/keys.json")
const moviedb = new MovieDb(keys["movie-db-key"])
exports.create = (req, res) => {
    console.log("UH")
    let data = req.body
    if(!data.item){
        console.log("ye ye")
        res.status(400).send()
        return
    }
    const request = {
        requester_id: req.user.id,
        item: JSON.stringify(data.item),
        date_reported: Date.now().toString(),
        comments: [],
        status: "reported"

    }
    console.log("in 1")
    Request.findAll()
        .then(resData => {
            if(!ifRequestItemExists(resData, request.item)) {
                const text = "User " + req.user.id +
                    "has issued a new request REQ000" + resData.length + 1
                const firstCom = {
                    type: "statusChange",
                    user: "system",
                    comment: text,
                    date: Date.now().toString()
                }
                request.comments.push(firstCom)
                request.comments = JSON.stringify(request.comments)
                Request.create(request)
                    .then(data => {
                        if (data) {
                            res.status(200).send()
                        } else res.status.send(500)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status.send(500)
                    })
            }
            else res.status(403).send()
        })
        .catch(err => {
            console.log(err)
            res.status.send(500)
        })

}

exports.getOne = (req, res) => {
    let rid = req.params.id
    Request.findByPk(rid)
        .then(data => {
            if (data) {
                res.send(data)
            } else res.status(404).send()
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
}

exports.getAll = (req, res) => {
    console.log("ja")
    const uRoles = JSON.parse(req.user.roles)
    Request.findAll()
        .then(data => {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i] = cleanReturnRequestsAll(data[i], uRoles)
                }
                res.send(data)
            } else res.status(404).send()
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
}

exports.getDateRange = (req, res) => {
    const uRoles = req.user.roles
    const dateStart = req.params.date_range.split('|')
    Request.findAll()
        .then(data => {
            if (data) {
                let returnData
                for (let i = 0; i < data.length; i++) {
                    if (data[i].date_reported > dateStart[0] &&
                        data[i].date_reported < dateStart[1]) {
                        returnData.push(cleanReturnRequestsAll(data[i], uRoles))
                    }
                }
                res.send(returnData)
            } else res.status(404).send()
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
}

exports.getBySubId = (req, res) => {
    let uRoles = JSON.parse(req.user.roles)
    let qid = req.params.id
    let uid = req.user.id
    let condition = uid ? {requester_id: {[Op.like]: `%${uid}%`}} : null
    if ((!uRoles.includes("Admin") ||
        !uRoles.includes("Service_user")) && (uid !== qid)) {
        console.log("tu ja req")
        res.status(401).send()
    } else {
        Request.findAll(condition)
            .then(data => {
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        data[i] = cleanReturnRequestsAll(data[i], uRoles)
                    }
                    res.send(data)
                } else res.status(404).send()
            })
            .catch(err => {
                console.log(err)
                res.status(500).send()
            })
    }
}

exports.getByType = (req, res) => {
    const uRoles = req.user.roles
    const type = req.params.type
    let condition = type ? {type: {[Op.like]: `%${type}%`}} : null

    Request.findAll(condition)
        .then(data => {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i] = cleanReturnRequestsAll(data[i], uRoles)
                }
                res.send(data)
            } else res.status(400).send()
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
}

exports.verify = (req, res) => {
    const type = req.params.type
    const title = req.query.title

    if(type === 'tv'){
        moviedb.searchTv({query: title})
            .then(data => {
                if(data) {
                    res.send(data)
                }
                else res.status(404).send()
            })
            .catch(err => {
                console.log(err)
                res.status(500).send()
            })
    }
    else if(type ==='movie'){
        moviedb.searchMovie({query: title})
            .then(data => {
                if(data) {
                    res.send(data)
                }
                else res.status(404).send()
            })
            .catch(err => {
                console.log(err)
                res.status(500).send()
            })
    }
    else res.status(400).send()
    /*
*/
}

exports.modifyId = (req, res) => {
    const toUpdate = req.body
    const id = req.params.id

    Request.update(toUpdate, {where: {id: id}})
        .then(data => {
            if (data.length === 1) {
                res.status(200).send()
            } else res.status(500).send()
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
}

exports.deleteId = (req, res) => {
    Request.destroy({where: {id: req.params.id}})
        .then(data => {
            if (data) {
                res.status(200).send()
            } else res.status(500).send()
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
}