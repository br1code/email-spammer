const nodemailer = require('nodemailer');
const SpamList = require('./models/spamList');
const Subscriber = require('./models/subscriber');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

function initializeEmailSpam() {
    SpamList.find({}, (error, spamLists) => {
        if (error) {
            console.log(error);
            return;
        }

        if (!spamLists || spamLists.length === 0) {
            console.log('Skipping Email Spam. No Spam Lists have been created yet.');
            return;
        }

        for (const spamList of spamLists) {
            initializeEmailSpamTask(spamList);
        }
    });
}

function initializeEmailSpamTask(spamList) {
    const intervalTime = convertMinutesToMilliseconds(spamList.interval);

    console.log(`Initializing Email Spam Task for Spam List with id ${spamList._id}`);
    console.log(`This task will be repeated every ${spamList.interval} minutes.`);

    // We set the interval to repeat the task after X minutes
    setInterval(() => {
        console.log(`Executing Email Spam Task for Spam List with id ${spamList._id}`);

        // fetch subscribers of that spam list again
        Subscriber.find({_id: {$in: spamList.subscribers}}, (error, subscribers) => {
            if (error) {
                console.log(`Something wrong happened while searching subscribers for Spam List with id ${spamList._id}.`, error);
                return;
            }

            if (!subscribers || subscribers.length === 0) {
                console.log(`Skipping Email Spam for Spam List with id ${spamList._id}. No subscribers on this list.`);
                return;
            }

            for (const subscriber of subscribers) {
                sendEmail({
                    subject: spamList.subject,
                    template: spamList.template
                }, subscriber);
            }
        });
    }, intervalTime);
}

function sendEmail(spamList, subscriber) {
    let email = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: spamList.subject, // TODO: add this to ListSpam model
        html: buildBody(spamList.template, subscriber)
    };

    console.log(`Sending email to ${subscriber.email}`);

    transporter.sendMail(email, (error, emailSent) => {
        if (error) {
            console.log(error);
            return;
        }

        console.log(`Email sent: ${emailSent.messageId}`);
    });
}

function buildBody(template, subscriber) {
    template = template.replace('#firstName', subscriber.firstName);
    template = template.replace('#lastName', subscriber.lastName);
    return template;
}

function convertMinutesToMilliseconds(minutes) {
    return minutes * 1000 * 60;
}

module.exports = initializeEmailSpam();
