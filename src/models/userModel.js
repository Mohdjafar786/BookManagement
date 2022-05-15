const mongoose=require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const userSchema= new mongoose.Schema({


    title: {
    type: String,
      trim:true,
     required:[true,'title field is required'],
     enum:["Mr", "Mrs", "Miss"]
    },
    name: {
        type:String, 
        required:[true,'name field is required'],
        trim:true
        },
    phone: {
        type:String,
        trim:true,
        required:[true,'phone field is required'],
        match: [/^[6789]\d{9}$/, 'The Phone number must be 10 digits and only Indian numbers are allowed'],
         unique:true
    
        },
    email: {
        type:String,
        trim:true,
        required:[true,'email field is required'],
        match:[/^([\w]*[\w\.]*(?!\.)@gmail.com)$/, 'Please fill a valid email address'],
     unique:true
    }, 
    password: {
       type: String,
       required:true,
       trim:true,
       minLength:[8,"minimum length should be 8"],
       maxLength:[15,"maximum length should be 15"]
    },
    address: {
        street:{
            type:String,
            trim:true
        },
        city:{
            type: String ,
            trim:true
        },
        pincode:{
            type:String ,
            match:[/^[1-9][0-9]{5}$/,'The valid pincode should contain exactly 6 digits'],
            trim:true
      },
    }

},{timestamps:true})
uniqueValidator.defaults.message = 'The {PATH} is already registered !'
userSchema.plugin(uniqueValidator);

module.exports=mongoose.model("user",userSchema)