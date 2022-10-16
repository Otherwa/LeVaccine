const mongoose = require('mongoose')
const URL = require('./connection_config').con;

mongoose.connect(URL, { useNewUrlParser: true })
const db = mongoose.connection;
db.on("error", () => { console.log("error in conection"); })
db.once('open', () => { console.log("Connected"); })

module.exports = mongoose