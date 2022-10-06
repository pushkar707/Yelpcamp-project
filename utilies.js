class AppError extends Error {
    constructor(message,status){
        super();
        this.message = message
        this.status = status
    }
}

const wrapAsync = (fn) => {
    return function(req,res,next){
        fn(req,res,next).catch(e=>next(e))
    }
}

module.exports = {AppError,wrapAsync}