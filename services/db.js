//Server mongodb integration

//1.import mongoose
const mongoose = require('mongoose');

//2.state connection string via mongoose

mongoose.connect('mongodb://localhost:27017/BankServer',
{
    useNewUrlParser:true //to avoid unwantted warnings
});

//Define bank db model

const User=mongoose.model('User',
{
    //schema creation
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
});

//export collection

module.exports={
    User
}