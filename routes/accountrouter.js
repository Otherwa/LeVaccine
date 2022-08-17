const express = require('express');
const Router  = express.Router();
const homeSchema = require('../models/userschema');

// index
Router.get('/',(err,res)=>{
    res.render('login',{tab:"Login-as"})
})

// if registered
Router.post('/register',async(req,res)=>{
   try{
       const {
           name,
           number,
           email,
           password,
           cpassword
       } = req.body;

    if(password === cpassword ){
       
         const userData = new homeSchema({
            name,
            number,
            email,
            password
         })
         userData.save(err=>{
             if(err){
                console.log("err")
             }else{
                res.render('dashboard', {name : 'name'})
             }
         })
       
    const useremail = await homeSchema.findOne({email:email});
     if(email === useremail.email){
        res.render('register',{title :'',password:'',email:'Email is Already there plz chose different one'})
     }else{
         console.log('err')
     }

    }else{
        res.render('register',{title :'',password:'Password not Matching',email:''})
    }
   }catch(error){

    res.render('register',{title :'Error in Code',password:'',email:''})
   }
})

// login
Router.post('/login',(req,res)=>{
    
    const {
        email,
        password    
    } = req.body;

    homeSchema.findOne({email:email},(err,result)=>{
        
        if(email === result.email && password === result.password){
            res.render('dashboard', {name : result.name})
        }else{
            console.log(err)

        }
    })
})



module.exports = Router;