const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');
const SpamList = require('../models/spamList');

router.post('/subscribe/:spamListId', (req, res) => {
    const spamListId = req.params.spamListId;

    SpamList.findById(spamListId, (error, spamList) => {
        if (error) {
            const errorMessage = `Something wrong happened while searching the Spam List.\nError: ${error.message}`
            console.log(errorMessage, error);
            res.status(500).json({success: false, error: errorMessage});
            return;
        }

        if (!spamList) {
            console.log(`We couldn't find a Spam List with the given id: ${spamListId}`);
            res.status(404).json({
                success: false,
                error: `We couldn't find a Spam List with the given id: ${spamListId}`
            });
            return;
        }

        const newSubscriber = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        Subscriber.create(newSubscriber, (error, subscriber) => {
            if (error) {
                const errorMessage = `Something wrong happened while creating new Subscriber.\nError: ${error.message}`
                console.log(errorMessage, error);
                res.status(500).json({success: false, error: errorMessage});
                return;
            }

            spamList.subscribers.push(subscriber);
            spamList.save();

            console.log(`There is a new subscriber for the Spam List with id ${spamListId}.`);

            res.status(201).json({success: true});
        });
    });
});

router.get('/unsubscribe/:spamListId/:subscriberId', (req, res) => {
    const spamListId = req.params.spamListId;
    const subscriberId = req.params.subscriberId;

    SpamList.findById(spamListId)
        .populate('subscribers')
        .exec((error, spamList) => {
            if (error) {
                const errorMessage = `Something wrong happened while searching the Spam List.\nError: ${error.message}`
                console.log(errorMessage, error);
                res.status(500).json({success: false, error: errorMessage});
                return;
            }

            if (!spamList) {
                const errorMessage = `We couldn't find a Spam List with the given id: ${spamListId}`;
                console.log(errorMessage);
                res.status(404).json({
                    success: false,
                    error: errorMessage
                });
                return;
            }

            const subscriber = spamList.subscribers.find(subs => subs._id.toString() === subscriberId);

            if (!subscriber) {
                const errorMessage = 'The given person is not subscribed to this list';
                console.log(errorMessage);
                res.status(404).json({success: false, error: errorMessage});
                return;
            }

            res.render('unsubscribe', {
                spamListId: spamListId,
                subscriberId: subscriberId,
                subscriberEmail: subscriber.email
            });
        });
});

router.delete('/unsubscribe/:spamListId/:subscriberId', (req, res) => {
    const spamListId = req.params.spamListId;
    const subscriberId = req.params.subscriberId;
    SpamList.findById(spamListId, (error, spamList) => {
        if (error) {
            const errorMessage = `Something wrong happened while searching the Spam List.\nError: ${error.message}`
            console.log(errorMessage, error);
            res.status(500).json({success: false, error: errorMessage});
            return;
        }

        if (!spamList) {
            const errorMessage = `We couldn't find a Spam List with the given id: ${spamListId}`;
            console.log(errorMessage);
            res.status(404).json({
                success: false,
                error: errorMessage
            });
            return;
        }

        const subscriberIndex = spamList.subscribers.findIndex(subscriberObjectId => subscriberObjectId.toString() === subscriberId);

        if (subscriberIndex === -1) {
            const errorMessage = 'The given person is not subscribed to this list';
            console.log(errorMessage);
            res.status(404).json({success: false, error: errorMessage});
            return;
        }

        Subscriber.findByIdAndRemove(subscriberId, (error, subscriberRemoved) => {
            if (error) {
                const errorMessage = `Something wrong happened while searching the Spam List.\nError: ${error.message}`
                console.log(errorMessage, error);
                res.status(500).json({success: false, error: errorMessage});
                return;
            }

            if (!subscriberRemoved) {
                const errorMessage = `We couldn't find a Subscriber with the given id: ${spamListId}`;
                console.log(errorMessage);
                res.status(404).json({
                    success: false,
                    error: errorMessage
                });
                return;
            }

            console.log(`Subscriber with id: ${subscriberRemoved._id} was removed from our system.`);

            spamList.subscribers.splice(subscriberIndex, 1);
            spamList.save();
            console.log(`Subscriber with id: ${subscriberRemoved._id} was removed from the Spam List with id ${spamList._id}.`);

            res.render('unsubscribed');
        });
    });
});

module.exports = router;
