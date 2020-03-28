// packages
var express = require('express');
var expressSession = require('express-session');
var ejs = require('ejs');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSession({
    // secret is used to encode and decode sessions, could be anything
    secret : "Hi this is Siddharth",
    resave : false,
    saveUninitialized : false
}
));
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true , useUnifiedTopology: true});


//========================================================
// Routes
//========================================================

app.get('/', function(req, res){
    res.render('home.ejs');
});

app.get('/secret', isLoggedIn, function(req, res){
    // isLoggedIn is middleware defined at the end
    res.render('secret.ejs');
});

// auth routes

//************************************
// sign-up routes
//************************************ 

// form to register/sign-up

app.get('/register', function(req, res){
    res.render('register.ejs');
});

//post sign-up form data

app.post('/register', function(req, res){

    // we have exported the user model created in user.js, UserSchema has been plugged in with passport local mongoose functions.
    // register is one such function which we have invoked below

    User.register(new User({ username : req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register.ejs');
        }

        // authenticating as soon as the user signs up
        passport.authenticate("local")(req, res, function(){
            res.redirect('/secret');
        });
    });
});

//************************************
// login routes
//************************************

// display login form
app.get('/login', function(req, res){
    res.render('login.ejs');
});

// perform login
// middleware is used below. so passport.authenticate() is run before the final callback method, multiple
// middlewares can be stacked
app.post('/login',passport.authenticate("local", {
    successRedirect : '/secret',
    failureRedirect : '/login'
}), function(req, res){

});

//*************************************** */
// logout login
// *********************************************


app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

//=====================================================
// end of routes
//=======================================================


//============================================
// middlewares
//======================================

//*********** */
// to check if user is logged in
//*********** */

function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            // if logged in execute next, which is the next method after the middleware is executed
            return next();
        }

        res.redirect('/login');
}

//============================================
// end of middlewares
//======================================
app.listen(3000, function(){
    console.log('App started');
});