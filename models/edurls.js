const mongoose = require('mongoose');
const schema = mongoose.Schema;

const edurls_schema = new schema({
    url: {
        required: true,
        type: 'string',
    },
    date: {
        required: true,
        type: 'string',
    },
}, {
    versionKey: false //here
})

module.exports = mongoose.model('edurls', edurls_schema);

