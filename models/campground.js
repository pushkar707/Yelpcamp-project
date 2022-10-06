const mongoose = require('mongoose')
const Review = require('./review')

const campgroundSchema = new mongoose.Schema({
    name: {
        type:String,
        // required:true
    },
    images:[
        {
            type:String
        }
    ],
    price:{
        type:Number,
        // required:true,
        // min:0
    },
    description:{
        type:String
    },
    location:{
        type:String,
        // required:true
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

campgroundSchema.post('findOneAndDelete',async(camp)=>{
    if(camp){
        await Review.deleteMany({
            _id:{$in: camp.reviews}
        })
    }    
})

const Campground = mongoose.model('Campground',campgroundSchema)
module.exports = Campground