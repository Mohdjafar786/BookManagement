const express = require('express');
var bodyParser = require('body-parser');
const multer  = require('multer')

const route = require('./route/route.js');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())



const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Mohdjafar:Acu5dzePFe31VRQE@cluster0.lim8w.mongodb.net/BookManagement",{useNewUrlParser:true})
.then(()=>console.log("MongoDb connected"))
.catch(err=>console.log(err))

app.use('/',route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});