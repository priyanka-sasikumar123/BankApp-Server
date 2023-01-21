//import jwt
const jwt=require('jsonwebtoken');

const db=require('./db.js')

 const register=(acno,username,password)=>{

   return db.User.findOne({acno})//data
      .then(user=>{
        if(user){
          return{
            status:'false',
            statusCode:400,
            message:'User already registered'
          }
          }
        else
        {
         const newUser=new db.User({
            acno,
            username,
            password,
            balance:0,
            transaction:[]
           })
          newUser.save();
           return {
          status:'true',
          statusCode:200,
          message:'Register Sucessfully'
        }
      }
     }) 
    }
    

 const login=(acno,pswd)=>
 {
  return db.User.findOne({acno,pswd})
  .then(user=>{
    if(user){
      currentuser=user.username;
      currentacno=acno;
      const token=jwt.sign({
        currentAcno:acno},
        'superkey2022')
        return{
          status:'true',
          statusCode:200,
          message:'Login Successful',
          token:token,
          currentuser:currentuser,
          currentacno:acno
        }
    }
   
    else{
      return{
        status:'false',
        statusCode:400,
        message:'Password Incorrect'
      }
    }
  })
}
const deposit=(acno,pswd,amt)=>
{
  var amt=parseInt(amt);
  return db.User.findOne({acno,pswd})
  .then(user=>
    {
     if(user){
        user.balance+=amt;
        user.transaction.push({
        Type:'Credit',
        Amount:amt
       })
        user.save();
       return{
        status:'true',
        statusCode:200,
        message:`${amt} is credited and balance is ${user.balance}`
       }
      }
      else{
        // alert('password mismatch');
        return{
          status:'false',
          statusCode:400,
          message:'password mismatch'
        }
      }
  })
           
}

 const withdraw=(acno,pswd,amt)=>
 {
    var amount=parseInt(amt);
    return db.User.findOne({acno,pswd})
    .then(user=>{
      if(user)
      {
        if(user.balance>amount)
        {
          user.balance-=amount;
          user.transaction.push({
            Type:'Debit',
            Amount:amount
           })
        }
        user.save()
          return {
            status:'true',
            statusCode:200,
            message:`${amount} is debited and balance is ${user.balance}`
            }
      }
        else
        {
          // alert('Transaction failed')
          return{
            status:'false',
            statusCode:400,
            message:'Transaction failed'
               }
        }
        
   })
}
const getTransaction=(acno)=>
 {
   return db.User.findOne({acno})
   .then(user=>
    {
      if(user)
      {
         return{
        status:'true',
        statusCode:200,
        transaction:user.transaction //details of transaction
         }
      }
      else
    {
      return{
        status:'false',
        statusCode:400,
        message:'Transaction failed'
           }
    }
   }) 
}
const deleteaccno=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(user){
      return {
        status:'true',
        statusCode:200,
        message:`User deleted successfully`
        }
    }
    else
    {
      return{
        status:'false',
        statusCode:400,
        message:'user not found'
           }
    }
  })
}
module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteaccno
}