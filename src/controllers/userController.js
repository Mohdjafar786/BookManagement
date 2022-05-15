const UserModel = require('../models/userModel')
const jwt=require ('jsonwebtoken')

const createUser = async function (req, res) {
    try {
         const data = req.body
         if(Object.keys(data)==0){return res.status(400).send({status : false,msg:'data  is missing'})}
      
        const createData = await UserModel.create(data)
        res.status(201).send({ status: true, data: createData })
    }
    catch (err) {
       // res.send(err)
       if(err['errors']!=undefined){
           let keys=Object.keys(err['errors'])
          // keys.reverse()
           let errorFields=[]
           for(let i=0;i<keys.length;i++){
               let field=err['errors'][keys[i]]
               errorFields.push(field['message'])
           }
           if(errorFields.length > 0){
            return res.status(400).send({status: false,message: errorFields[0]}); 
        }
    }

    return res.status(500).send({status: false,message: err.message}); 
       }
    }


const loginUser=async function(req,res){
    try{
    const data=req.body
    if(Object.keys(data)==0){return res.status(400).send({status : false,msg:'data is missing'})}
   
    const {email, password } = data


//email is required
    if (email===undefined ||email.trim()=='') {
        return res.status(400).send({status : false,msg:'email is required'})
    }

    //password is required
    if (password===undefined ||password.trim()=='') {
        return res.status(400).send({status : false,msg:'password is required'})
    }

    // email is not registered
      const findEmail= await UserModel.findOne({email:email})
      if(!findEmail){ return res.status(400).send({status : false,msg:'email is not registered'})}

     // password is invalid
      const findPassword= await UserModel.findOne({password:password})
      if(!findPassword){ return res.status(400).send({status : false,msg:'password is invalid'})}


if(findEmail && findPassword)
{
    // creating token
    const  token =  jwt.sign({
        userId:findEmail._id,
     },'Book-Management',{expiresIn:"1h"})
    res.header('x-api-key',token)
     //res.setHeader('x-api-key',token)
     return res.status(200).send({ status: true, message: 'User login successfully', token: token })
}
}
catch (err) {
  
    res.status(500).send({ status:false,error: err.message })
}
}

module.exports.loginUser = loginUser

module.exports.createUser = createUser

