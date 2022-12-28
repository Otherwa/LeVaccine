const mongoose = require('mongoose')
const URL = require('./connection_config').con;

async function connect() {
    mongoose.set("strictQuery", false);
    mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    const mongo = mongoose.connection;
    mongo.on("error", () => { console.log("error in Conection service"); })
    mongo.once('open', () => { console.log("Connected service Mongoose"); })
}

async function dis() {
    mongoose.disconnect();
    console.log("disconnected");
}

module.exports = { connect, dis }