const mongoose = require('mongoose')
const Campground = require('../models/campground')
const Review = require('../models/review')
const User = require('../models/user')
const cities = require('./cities')
const {descriptors,places} = require('./seedHelpers')

mongoose.connect("mongodb+srv://pushkar707:Iamverybest1@cluster0.jpbmqn2.mongodb.net/yelp-camp?retryWrites=true&w=majority")
.then(()=>{
    console.log("Connected to Mongoose");
})
.catch(err=>{
    console.log('Not connected to mongoose');
    console.log(err);
})

const randArr = (arr) => arr[Math.floor(Math.random()*arr.length)]

const seedDb = async()=>{
    await Campground.deleteMany({})
    for (let index = 0; index < 20; index++) {
        const name = `${randArr(descriptors)} ${randArr(places)}`
        const price = Math.floor(Math.random()*40)*100+1000
        const loc = randArr(cities)
        const location = `${loc.city}, ${loc.state}`
        const description = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro tenetur aut ex totam explicabo labore ipsa, dolorum, illum quaerat quam pariatur hic quos optio nam odio dolor consectetur, accusamus recusandae!"
        const images = 'https://source.unsplash.com/collection/483251'
        const owner = '63220bdb144e2c89f273aaff'
        const review = new Review({rating:5,body:"This is a very good campground. You must give it a try atleast once",author:'63220bdb144e2c89f273aaff'})
        await review.save()
        const campground = new Campground({name,price,location,description,images,owner,reviews:[review]})
        await campground.save()         
    }
}

seedDb().then(()=>{
    mongoose.connection.close()
})