const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');
const ListSpam = require('../models/listSpam');

// TEMPORARY ROUTE - TODO: REMOVE
// Get a list of subscribers to a specific spam list
router.get('/subscribers/:listSpamId', (req, res) => {
    ListSpam.findById(req.params.listSpamId)
        .populate('subscribers')
        .exec((error, listSpam) => {
            if (error || !listSpam) {
                const errorMessage = `Something wrong happened while the List Spam was being searched or ` +
                    `no list has been found with that id.\n$Error:{error.message}`;
                console.log(errorMessage, error);
                res.status(500).json({ error: errorMessage });
                return;
            }

            const subscribers = listSpam.subscribers.map(subscriber => {
                return {
                    id: subscriber._id,
                    email: subscriber.email,
                    fullName: `${subscriber.firstName} ${subscriber.lastName}`
                };
            });

            res.json({
                listSpamId: listSpam._id,
                subscribers: subscribers
            });
        });
});

router.post('/subscribe/:listSpamId', (req, res) => {
    // TODO: validate body and listspamid
    ListSpam.findById(req.params.listSpamId, (error, listSpam) => {
        if (error || !listSpam) {
            const errorMessage = `Something wrong happened while the list was being searched or ` +
                `no list has been found with that id.\nError: ${error.message}`;
            console.log(errorMessage, error);
            res.status(500).json({ error: errorMessage });
            return;
        }

        const newSubscriber = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        Subscriber.create(newSubscriber, (error, subscriber) => {
            if (error) {
                const errorMesage = `Something wrong happened while creating new Subscriber.\nError: ${error.message}`
                console.log(errorMesage, error);
                res.status(500).json({ error: errorMesage });
                return;
            }

            listSpam.subscribers.push(subscriber);
            listSpam.save();

            console.log(`There is a new subscriber for the list spam ${listSpam._id}!`);

            res.status(200).json({ ok: true });
        });
    });
});

router.get('/unsubscribe/:listSpamId/:subscriberId', (req, res) => {
    // TODO: valdate params
    ListSpam.findById(req.params.listSpamId)
        .populate('subscribers')
        .exec((error, listSpam) => {
            if (error || !listSpam) {
                const errorMessage = `Something wrong happened while the List Spam was being searched or ` +
                    `no list has been found with that id.\nError:${error.message}`;
                console.log(errorMessage, error);
                res.status(500).json({ error: errorMessage });
                return;
            }

            const subscriber = listSpam.subscribers.find(subs => subs._id == req.params.subscriberId);

            if (!subscriber) {
                const errorMessage = 'The given person is not subscribed to this list';
                console.log(errorMessage);
                res.status(500).json({ error: errorMessage });
                return;
            }

            res.render('unsubscribe', {
                listSpamId: req.params.listSpamId,
                subscriberId: req.params.subscriberId,
                subscriberEmail: subscriber.email
            });
        });
});

router.delete('/unsubscribe/:listSpamId/:subscriberId', (req, res) => {
    ListSpam.findById(req.params.listSpamId, (error, listSpam) => {
        if (error || !listSpam) {
            const errorMessage = `Something wrong happened while the List Spam was being searched or ` +
                `no list has been found with that id.\nError:${error.message}`;
            console.log(errorMessage, error);
            res.status(500).json({ error: errorMessage });
            return;
        }

        const subscriberIndex = listSpam.subscribers.findIndex(subscriberId => subscriberId.toString() === req.params.subscriberId);

        if (subscriberIndex === -1) {
            const errorMessage = 'The given person is not subscribed to this list';
            console.log(errorMessage);
            res.status(500).json({ error: errorMessage });
            return;
        }

        listSpam.subscribers.splice(subscriberIndex, 1);
        listSpam.save();
        console.log(`Subscriber with id: ${req.params.subscriberId} removed from list ${listSpam._id}.`);

        Subscriber.findByIdAndRemove(req.params.subscriberId, (error, subscriberRemoved) => {
            if (error || !subscriberRemoved) {
                const errorMessage = `Something wrong happened while removing subscriber with id: ${req.params.subscriberId}` +
                    `or no subscriber has been found with that id.\nError:${error.message}`;
                console.log(errorMessage, error);
                res.status(500).json({ error: errorMessage })
                return;
            }

            console.log(`Subscriber with id: ${subscriberRemoved._id} removed from our system.`);
            res.status(200).json({ ok: true });
        });
    });
});

module.exports = router;