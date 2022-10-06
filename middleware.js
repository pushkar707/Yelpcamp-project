const Campground = require("./models/campground")
const {AppError} = require('./utilies')
const Joi = require('joi')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','Login Required')
        if(req.method == 'GET'){
            req.session.returnTo = req.originalUrl
        }
        return res.redirect('/login')
    }
    next()
}

module.exports.isOwner = async(req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground.owner.equals(req.user._id)){
        req.flash('error','You are not allowed to do that')
        return res.redirect(`/campground/${id}`)
    }else{
        next()
    }
}

module.exports.validateCampground = (req,res,next)=>{
    const campgroundchema = Joi.object({
        name:Joi.string().required(),
        price:Joi.number().required().min(0),
        images:Joi.array().items(Joi.string()),
        location:Joi.string().required(),
        description: Joi.string()
    })
    let camp_info = {}
    if(req.files){
        const images = req.files.map(file=>file.path)
        camp_info = {...req.body,images}
    }else{
        camp_info = req.body
    }
    const {error} = campgroundchema.validate(camp_info)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400)
    }else{
        next()
    }
}


module.exports.validateReview = (req,res,next)=>{
    const reviewSchema = Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    })
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new AppError(msg,400)
    }else{
        next()
    }
}