const express = require('express');
const router = express.Router();
const SpamList = require('../models/spamList');

router.get('/new', (req, res) => {
    res.render('new');
});

router.post('/new', (req, res) => {
    // TODO: validate

    const newSpamList = {
        template: req.body.template,
        interval: req.body.interval
    };

    SpamList.create(newSpamList, (error, spamList) => {
        if (error) {
            console.log('Something wrong happened while creating new Spam List.\n', error);
            res.status(500).json({error: error.message});
            return;
        }

        console.log(`New Spam List created successfully with id: ${spamList._id}`);
        res.status(501).json({success: true, id: spamList._id});
    });
});

module.exports = router;
