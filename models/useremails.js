
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Email_schema = new schema({
    email: {
        required: true,
        type: 'string',
        unique: true,
    },
    date: {
        required: true,
        type: 'string',
    },
}, {
    versionKey: false //here
})

module.exports = mongoose.model('subscribers', Email_schema);

