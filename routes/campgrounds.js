const {wrapAsync} = require('../utilies')
const {isLoggedIn,isOwner,validateCampground} = require('../middleware')
const express = require('express')
const router = express.Router()
const campground = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.get('/all',wrapAsync(campground.allCamps))

router.route('/new')
.get(isLoggedIn,campground.newCampForm)
.post(isLoggedIn,upload.array('image'),validateCampground,wrapAsync(campground.createNewCamp))

router.get('/:id',wrapAsync(campground.showCamp))

router.route('/:id/update')
.get(isLoggedIn,isOwner,wrapAsync(campground.updateForm))
.put(isLoggedIn,isOwner,validateCampground,wrapAsync(campground.updateCamp))

router.route('/:id/add_img')
.get(isLoggedIn,wrapAsync(campground.imageForm))
.post(isLoggedIn,upload.array('images'),wrapAsync(campground.add_img))

router.delete('/:id/delete',isLoggedIn,isOwner,wrapAsync(campground.deleteCamp))

module.exports = router