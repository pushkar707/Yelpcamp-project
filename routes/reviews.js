const {wrapAsync} = require('../utilies')
const {isLoggedIn,validateReview} = require('../middleware')
const express = require('express')
const router = express.Router({mergeParams:true})
const review = require('../controllers/reviews')

router.post('/add',isLoggedIn,validateReview,wrapAsync(review.addReview))

router.delete('/:reviewid',isLoggedIn,wrapAsync(review.deleteReview))

module.exports = router