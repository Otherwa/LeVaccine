const mongoose = require('mongoose')
const URL = require('./connection_config').con;

async function connect() {
    mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    const mongo = mongoose.connection;
    mongo.on("error", () => { console.log("error in Conection service"); })
    mongo.once('open', () => { console.log("Connected service"); })
}

module.exports = { connect }