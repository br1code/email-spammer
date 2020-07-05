const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const customMiddlewares = require('./middleware');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

const customRoutes = require('./routes');

mongoose.connect("mongodb://localhost/email-spammer", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

app.get('/status', (req, res) => {
    res.status(200).end();
});

app.head('/status', (req, res) => {
    res.status(200).end();
});

app.enable('trust proxy');

app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/web/public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/web/views');

app.use(customMiddlewares.logger);

// custom routes 

app.get('/', (req, res) => {
    res.send('Email Spam Service! go to /new to create a new Spam List.');
});

app.use(customRoutes.spamList);
app.use(customRoutes.subscriber);

// end custom routes

app.get('*', (req, res) => {
    res.status(404).json({error: 'Route not found'});
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}.`);
});
