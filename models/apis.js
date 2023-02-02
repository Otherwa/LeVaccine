const mongoose = require('mongoose');
const schema = mongoose.Schema;

const api = new schema({
    apikey: {
        required: true,
        type: 'string',
    },
    date: {
        required: true,
        type: 'string',
    },
}, {
    versionKey: false, //here
    timestamps: true
})

module.exports = mongoose.model('apikeys', api);

