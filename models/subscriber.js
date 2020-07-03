const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});

const subscriberModel = mongoose.model('Subscriber', subscriberSchema, "Subscriber");

module.exports = subscriberModel;
