const mongoose = require('mongoose');

const spamListSchema = new mongoose.Schema({
    template: {
        type: String,
        required: true
    },
    interval: {
        type: Number,
        default: 3
    },
    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscriber'
        }
    ]
});

const spamListModel = mongoose.model('SpamList', spamListSchema, "SpamList");

module.exports = spamListModel;
