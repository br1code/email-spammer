const mongoose = require('mongoose');

const listSpamSchema = new mongoose.Schema({
    template: {
        type: String,
        required: true
    },
    interval: {
        type: Number,
        default: 3
    },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber' }]
});

const listSpamModel = mongoose.model('ListSpam', listSpamSchema, "ListSpam");

module.exports = listSpamModel;