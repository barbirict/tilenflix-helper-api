const sKey = require("../config/keys.json").keys.sha256.key
const crypto = require("crypto")

exports.encryptData = (data) => {
    //console.log("TEST: " + data.toString("hex"))
    console.log("DATA: ", JSON.stringify(data))
    const iv = crypto.randomBytes(16)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(sKey, "hex"), iv)
    let encrypted = cipher.update(JSON.stringify(data))
    encrypted = Buffer.concat([encrypted, cipher.final()])
    //console.log("Encrypzed return: ", iv.toString("base64") + "." + encrypted.toString("base64"))
    console.log("Encrypzed return: ", iv.toString("hex") + "." + encrypted.toString("hex"))
    return iv.toString("base64") + "." + encrypted.toString("base64")
}