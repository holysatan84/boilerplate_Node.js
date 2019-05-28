const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

//Load Keys
const keys = require('./config/keys');

//Passport Config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Mongo DB Connected'))
    .catch(err => console.log(err));

//Cookie Parser Middleware
app.use(cookieParser());

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req,res,next)=>{
    res.locals.user = req.user || null
    next();
});
//Use Routes
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.send('It works ! ');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Started On Port ${port} ! `);
});