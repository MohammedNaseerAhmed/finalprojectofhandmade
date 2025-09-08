const exp=require('express')
const sellerApp=exp.Router();
const userModel=require('../Models/UsersModel')
const handler=require('express-async-handler')
const roles=require('../roles')
sellerApp.post('/user',handler(roles))
sellerApp.get('/users',handler(async(req,res)=>{
    let r=await userModel.find({isActive:true,role:"seller"})
    res.status(200).send({message:"getting seller Details",payload:r})
}));
sellerApp.get("/user/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let seller = await userModel.findById(userId);

    if (!seller || seller.role !== "seller") {
        return res.status(404).send({ message: "Seller not found" });
    }

    res.status(200).send({ message: "Seller found", payload: seller });
}));


sellerApp.put("/user/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let updates = req.body;
let updatedSeller = await userModel.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
    );
    if (!updatedSeller || updatedSeller.role !== "seller") {
        return res.status(404).send({ message: "Seller not found" });
    }

    res.status(200).send({ message: "Seller updated successfully", payload: updatedSeller });
}));
sellerApp.delete("/user/:userId", handler(async (req, res) => {
    let { userId } = req.params;

    let deletedSeller = await userModel.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
    );

    if (!deletedSeller || deletedSeller.role !== "seller") {
        return res.status(404).send({ message: "Seller not found" });
    }

    res.status(200).send({ message: "Seller deleted (soft delete)", payload: deletedSeller });
}));

module.exports=sellerApp;