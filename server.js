const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express();
const db = require("./app/models")
const cookieParser = require("cookie-parser");
const https= require('https')
const fs = require('fs')

//db.sequelize.sync()

//DEV ONLY:
/*
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
})
*/

//Cors
const corsOptions = {
    origin: "https://localhost:2323",
    credentials: true
};
app.use(cors(corsOptions))

//Parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Routes
require("./app/routes/routes")(app)
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        //console.log(err)
        res.status(401).send('<h1>401 - INVALID TOKEN</h1>');
    }
});
const PORT = process.env.PORT || 2323
const httpsServer = https.createServer({
    key: fs.readFileSync(__dirname+'/app/config/key.pem'),
    cert: fs.readFileSync(__dirname+'/app/config/cert.pem')
}, app)

httpsServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})