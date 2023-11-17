// create web server
const express = require('express');
const app = express();
// create server
const server = require('http').Server(app);
// create socket.io
const io = require('socket.io')(server);
// create mongoose
const mongoose = require('mongoose');
// create body-parser
const bodyParser = require('body-parser');
// create express-session
const session = require('express-session');
// create connect-mongo
const MongoStore = require('connect-mongo')(session);
// create connect-flash
const flash = require('connect-flash');
// create moment
const moment = require('moment');
// create express-validator
const expressValidator = require('express-validator');
// create config
const config = require('./config/secret');

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

// set the view engine
app.set('view engine', 'ejs');
// use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// use express-session
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ url: config.database, autoReconnect: true })
}));
// use connect-flash
app.use(flash());
// use express-validator
app.use(expressValidator());
// use moment
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});
// use custom middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    next();
});

// define the route
const home = require('./routes/home');
const user = require('./routes/user');
const comment = require('./routes/comment');
const admin = require('./routes/admin/admin');
const adminCategory = require('./routes/admin/category');
const adminPost = require('./routes/admin/post');
const adminComment = require('./routes/admin/comment');
const adminUser = require('./routes/admin/user');

// use the route
app.use('/', home);
app.use('/user', user);
app.use('/comment', comment);
app.use('/admin', admin);
app.use('/admin/category', adminCategory);
app.use('/admin/post', adminPost); 
