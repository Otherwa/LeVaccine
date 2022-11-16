const mongoose = require('mongoose')
const URL = require('./connection_config').con;

async function connect() {
    mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    const mongo = mongoose.connection;
    mongo.on("error", () => { console.log("error in Conection service"); })
    mongo.once('open', () => {
        console.log("Mongoose Connection Connected 200");
    })
}

async function dis() {
    mongoose.disconnect();
    console.log("disconnected");
}

module.exports = { connect, dis }