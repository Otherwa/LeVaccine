const mongoose = require('mongoose');
const schema = mongoose.Schema;

const edurls_schema = new schema({
    url: {
        unique: true,
        required: true,
        type: 'string',
    },
    description: {
        type: 'string',
    },
    date: {
        required: true,
        type: 'string',
    }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('edurls', edurls_schema);

