const exp=require('express')
const buyerApp=exp.Router();
const handler=require('express-async-handler')
const roles=require('../roles')
const userModel=require('../Models/UsersModel')
// Keeping legacy endpoint but discourage its use; prefer /auth/register and /auth/login
buyerApp.post('/user',handler(roles))
buyerApp.get('/users',handler(async(req,res)=>{
    let r=await userModel.find({isActive:true,role:"buyer"})
    res.status(200).send({message:"getting buyer details",payload:r})
}))
buyerApp.get("/user/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let buyer = await userModel.findById(userId);
  if (!buyer) {
        return res.status(404).send({ message: "Buyer not found" });
    }
    res.status(200).send({ message: "Buyer found", payload: buyer });
}));

module.exports=buyerApp;