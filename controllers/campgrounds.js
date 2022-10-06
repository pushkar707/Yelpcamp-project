const Campground = require('../models/campground')

module.exports.allCamps = async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/all.ejs',{campgrounds})
}

module.exports.newCampForm = (req,res)=>{
    res.render('campground/new.ejs')
}

module.exports.createNewCamp = async(req,res)=>{
    const images = req.files.map(file=>file.path)
    const campground = new Campground(req.body)
    campground.owner = req.user._id
    campground.images = images
    await campground.save()
    req.flash('success',"Campground Added Successfully")
    res.redirect(`/campground/${campground._id}`)
}

module.exports.showCamp = async(req,res)=>{
    const {id} = req.params
    try{
        const campground = await Campground.findById(id).populate({
            path:'reviews',
            populate:'author'
        }).populate('owner')
        res.render('campground/show.ejs',{campground})
    }catch(e){
        req.flash('error','Campground Not Found')
        return res.redirect('/campground/all')
    }
}

module.exports.updateForm = async(req,res,next)=>{
    const {id} = req.params
    try {
        const campground = await Campground.findById(id)
        res.render('campground/update.ejs',{campground})        
    } catch (error) {
        req.flash('error',"Campground Not Found")
        res.redirect(`/campground/all`)
    }
}

module.exports.updateCamp = async(req,res)=>{
    const {id} = req.params
    try {
        await Campground.findByIdAndUpdate(id,req.body,{runValidators:true})
        req.flash('success',"Campground Updated Successfully")
        res.redirect(`/campground/${id}`)
    } catch (e) {
        req.flash('error','Campground Not Found')
        return res.redirect('/campground/all')
    }
}

module.exports.deleteCamp = async(req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success',"Campground Deleted Successfully")
    res.redirect('/campground/all')
}

module.exports.imageForm = async(req,res) =>{
    const {id} = req.params
    try {
        const campground = await Campground.findById(id)
        res.render('add_image.ejs',{campground})        
    } catch (error) {
        req.flash('error',"Campground Not Found")
        res.redirect(`/campground/all`)
    }
}

module.exports.add_img = async(req,res)=>{
    const {id} = req.params
    const images = req.files.map(file=>file.path)
    const campground = await Campground.findById(id)
    campground.images.push(...images)
    await campground.save()
    req.flash('success',"Images Added Successfully")
    res.redirect(`/campground/${id}`)
}