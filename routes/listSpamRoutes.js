const express = require('express');
const router = express.Router();
const ListSpam = require('../models/listSpam');

router.get('/new', (req, res) => {
    res.render('new');
});

router.post('/new', (req, res) => {
    // TODO: validate

    const newListSpam = {
        template: req.body.template,
        interval: req.body.interval
    };

    ListSpam.create(newListSpam, (error, listSpam) => {
        if (error) {
            console.log('Something wrong happened while creating new List Spam.\n', error);
            res.status(500).json({ error: error.message });
            return;
        }

        console.log(`New List Spam created successfully with id: ${listSpam._id}`);
        res.render('success', { listSpamId: listSpam._id });
    });
});

module.exports = router;