const jwt = require('jsonwebtoken')
const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')

const mongoose=require('mongoose')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
const authentication = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) { return res.status(404).send({status : false,msg:"token must be present"}) }
                    jwt.verify(token, 'Book-Management',async (err,decodedToken)=>{
            if(err){
                 return res.status(401).send({status : false,msg:err.message}) 
            }
             const userRes= await UserModel.findById(decodedToken.userId)
            if(!userRes){
                return res.status(401).send({status : false,msg:"you are unauthenticated,please register your account"}) 
            }
         next()
        })
    }
    catch (err) {
        return res.status(500).send({status : false, error: err.message })
    }
}

const authorize=async function(req,res,next){
    try{
    const token = req.headers["x-api-key"]
    const decodedToken = jwt.verify(token, 'Book-Management')

    const data =req.body
    if(Object.keys(data)==0){return res.status(400).send({status:false,msg:'data  is missing'})}
      
    
    if(data.userId==undefined)
    { return res.status(400).send({status:false,msg:'userId is required'})}
 
    let userId = data.userId.trim()
     if (!isValidObjectId(userId)) 
     { return res.status(400).send({status:false,msg:' Invalid userId'})}
         data.userId =userId
         
    const findUser = await UserModel.findById(data.userId)
    if (!findUser) { return res.status(404).send({status:false,msg:'user does not exist'}) }

    if ( userId!= decodedToken.userId) {
        return res.status(403).send({status:false,msg:'user is not allowed to create Book'})
    }

next()
} catch(err){
   res.status(500).send({status:false,error:err.message})
}
}

const authorization = async function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        const decodedToken = jwt.verify(token, 'Book-Management')
        const bookId = req.params.bookId
        if(!isValidObjectId(bookId.trim())){
            return res.status(404).send({ status : false, msg : "Invalid bookId"})
        }
        const findBook = await BookModel.findById(bookId)
       if (!findBook) { return res.status(404).send({status : false,msg:'book does not exist'}) }

        if (findBook.userId != decodedToken.userId) { return res.status(401).send({status :false,msg:'user is not allowed to make changes'}) }
        next()
    }
    catch (err) {
        return res.status(500).send({ status : false,error: err.message })
    }
}



module.exports.authentication = authentication
module.exports.authorize = authorize
module.exports.authorization = authorization



