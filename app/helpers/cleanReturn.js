exports.cleanReturn = function (data){
        let outData ={
            id: "",
            username: "",
            name: "",
            surname: "",
            roles: [""]
        }
        outData.id = data.id
        outData.username = data.username
        outData.name = data.name
        outData.surname = data.surname
        outData.roles = JSON.parse(data.roles)
        return outData
}

exports.cleanReturnRequestsAll = function (data, roles){
    if(roles.includes("Admin") || roles.includes("Service_user")){
        return  {
            id: data.id,
            requester_id: data.requester_id,
            item: data.item,
            date_reported: data.date_reported,
            date_finished: data.date_finished,
            comments: data.comments,
            status: data.status
        }

    }
    else {
        return  {
            id: data.id,
            item: data.item,
            date_reported: data.date_reported,
            date_finished: data.date_finished,
            status: data.status
        }
    }
}