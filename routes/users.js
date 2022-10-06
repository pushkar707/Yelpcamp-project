const {wrapAsync} = require('../utilies')
const express = require('express')
const router = express.Router({mergeParams:true})
const passport = require('passport')
const user = require('../controllers/users')

router.route('/register')
.get(user.registerForm)
.post(wrapAsync(user.registerUser))

router.route('/login')
.get(user.loginForm)
.post(passport.authenticate('local', {failureFlash: true,failureRedirect: '/login'}),user.loginUser)

router.get('/logout',user.logoutUser)

module.exports = router