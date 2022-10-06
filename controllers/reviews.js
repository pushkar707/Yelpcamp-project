const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.addReview = async(req,res)=>{
    const {id} = req.params;
    const {rating,body} = req.body
    const review = new Review({rating,body})
    review.author = req.user._id
    await Campground.findByIdAndUpdate(id,{$push:{reviews:review}})
    await review.save()
    req.flash('success',"Review Added Successfully")
    res.redirect(`/campground/${id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewid} = req.params
    const review = await Review.findById(reviewid)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You are not allowed to do that')
        return res.redirect(`/campground/${id}`)
    }
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash('success',"Review Deleted Successfully")
    res.redirect(`/campground/${id}`)
}