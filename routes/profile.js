const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>{
    //console.log(req.user)
    const user=req.user
    res.render('profile',{showUser:{user},user:{user}})
})

module.exports=router