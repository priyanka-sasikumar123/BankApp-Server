//server creation

//1.import express
const express=require('express');


//import dataservices

const dataservices = require('./services/data.service')

//import cors
const cors = require('cors');


//import jwt
const jwt=require('jsonwebtoken')
//2.create an application using the express.
const app = express();

//To parse json from request body
app.use(express.json())

//Give command to share data via cors
app.use(cors({
    origin:['http://localhost:4200','http://192.168.24.78:8080','http://localhost:56068']
}))


//3.create a port number

app.listen(3000,()=>{
    console.log('listening on port 3000');
})
//Application Middle ware
const appMiddleware=(req,res,next)=>{
    console.log('Application specific middleware');
    next();
}
app.use(appMiddleware);

//Router Middleware
const jwtMiddleware=(req,res,next)=>{
    try{
        console.log('Router specific Middleware');

        const token=req.headers['x-access-token'];
        const data=jwt.verify(token,'superkey2022');
        console.log(data);
        next();
    }
    catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            message:'Please Login first'
        })
    }
   
}
//Resolving Http request
//get.post.put,delete,patch

// app.get('/',(req,res)=>{
//     res.send('Get request')
// })
// app.post('/',(req,res)=>{
//     res.send('post request')
// })
// app.put('/',(req,res)=>{
//     res.send('put request')
// })
// app.patch('/',(req,res)=>{
//     res.send('patch request')
// })
// app.delete('/',(req,res)=>{
//     res.send('delete request')
// })
//API request
//1.registration request
app.post('/register',(req,res)=>{
    console.log(req.body);
    const result=dataservices.register(req.body.acno,req.body.username,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })   
});
//2.login request
app.post('/login',(req,res)=>{
    console.log(req.body);
    const result=dataservices.login(req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result);
    }) 
})
//3.deposit request
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    const result=dataservices.deposit(req.body.acno,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
   
})
//4.withdraw request
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    const result=dataservices.withdraw(req.body.acno,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})

//5.transaction request
app.post('/transaction',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    const result=dataservices.getTransaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})
//6.delete request
app.delete('/deleteaccno/:acno',(req,res)=>{
    dataservices.deleteaccno(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})