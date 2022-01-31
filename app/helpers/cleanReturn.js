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