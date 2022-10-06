if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const camps = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const users = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')

const app = express()

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Connected to Mongoose");
})
.catch(err=>{
    console.log('Not connected to mongoose');
    console.log(err);
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))

const sessionConfig = {
    secret:"This is secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/',(req,res)=>{
    res.redirect('/campground/all')
})

app.use('/',users)
app.use('/campground',camps)
app.use('/campground/:id/review',reviews)

app.use((err, req, res, next) => {
    const { status = 500} = err;
    if(!err.message){err.message ="Something went wrong"}
    res.status(status).render('error',{err});
})

app.listen('3000',()=>{
    console.log("connected to port 3000");
})
