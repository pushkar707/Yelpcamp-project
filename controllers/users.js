const User = require('../models/user')

module.exports.registerForm = (req,res)=>{
    res.render('user/register.ejs')
}

module.exports.registerUser = async(req,res)=>{
    try {
        const {email,username,password} = req.body
        const user = new User({email,username})
        const finalUser = await User.register(user,password)
        req.login(finalUser,err=>{
            if(err){throw new AppError(err)}
            req.flash('success','Registered Successfully')
            res.redirect('/')
        })
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('/register')
    }
    
}

module.exports.loginForm = (req,res)=>{
    res.render('user/login.ejs')
}

module.exports.loginUser = (req,res)=>{
    const redirect = req.session.returnTo || '/'
    delete req.session.returnTo;
    req.flash('success','Logged in Successfully')
    res.redirect(redirect)
}

module.exports.logoutUser = (req,res) =>{
    req.logout()
    req.flash('success','Logged Out')
    res.redirect('/')
}