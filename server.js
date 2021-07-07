const express = require('express');
require('dotenv').config()
const morgan = require('morgan');

// Define variables to call express functions
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./db/dbConfig');
const cp = require('cookie-parser');
//const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const logger = require('log4js')
    .configure({
        appenders: {
            errors: { type: 'file', filename: './errors.log' },
            access: { type: 'file', filename: './access.log' },
        },
        categories: { default: { appenders: ['errors', 'access'], level: 'info' } },
    })
    .getLogger(['errors', 'access']);

app.use(require('cors')({
    preflightContinue: true,
    credentials: true,
    origin: [
        'http://localhost:3000',
        'http://localhost:3000',
    ],
    allowedHeaders: ['Origin', 'Content-Type', 'Authorization', 'content-type'],
    methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']
}))

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        path: '/',
        maxAge: 60000,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    key: 'sid',
    proxy: true,
    store: new KnexSessionStore({
        knex: db,
        createtable: true
    })
}
app.enable('trust-proxy', 1);
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(session(sessionConfig))
app.use(cp(process.env.SESSION_SECRET))
morgan.token('ip', (req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress);
morgan.token('user', (req) => {
    if (req.session) {
        if (req.session.user) {
            return req.session.user.username;
        }
        else {
            return 'no user info'
        }
    }
});

function jsonFormat(tokens, req, res) {
    return JSON.stringify({
        ip: tokens.ip(req, res),
        user: tokens.user(req, res),
        time: new Date().toISOString(),
        method: req.method,
    });
}

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.csv'), {
    flags: 'a'
});
app.use(morgan(jsonFormat, { stream: accessLogStream }));
app.use(express.json());
app.use('/api', require('./routes/router-index'));


// Error Handling
let errors = 0;
app.use((error, req, res, next) => {
    logger.error(error)
    errors++;
    console.log(`You have ${errors} server errors`)
    console.log(error.message);
    return res.status(500).json('There was an internal server error')
});

module.exports = app;