const db = require("../models")
const {cleanReturnRequestsAll} = require("../helpers/cleanReturn");
const {MovieDb} = require("moviedb-promise");
const Request = db.requests
const Op = db.Sequelize.Op
const moviedb = new MovieDb('key')

exports.create = (req, res) => {
    let data = req.body
    if(!data.requester_id || !data.item){
        res.status(400).send()
        return
    }
    const request = {
        requester_id: data.requester_id,
        item: data.item,
        date_reported: Date.now().toString(),
        comments: []

    }
    let cLength
    Request.findAll()
        .then(resData => {
            const firstCom = "User " + data.requester_id +
                "has issued a new request REQ" + resData.length+1
            request.comments.push(firstCom)
            Request.create(request)
                .then(data => {
                    if(data){
                        res.status.send(200)
                    }
                    else res.status.send(500)
                })
                .catch(err => {
                    console.log(err)
                    res.status.send(500)
                })
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
    const uRoles = JSON.parse(req.user.roles)
    Request.findAll()
        .then(data => {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    data[i] = cleanReturnRequestsAll(data[i], uRoles)
                }
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
    const title = req.params.title
    moviedb.searchMovie({query: title})
        .then(data => {
            if(data) {
                console.log(data)
                res.send(data)
            }
            else res.status(404).send()
        })
        .catch(err => {
            console.log(err)
            res.status(500).send()
        })
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