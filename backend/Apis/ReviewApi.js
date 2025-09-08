const exp=require('express')
const reviewApp=exp.Router();
const Review=require('../Models/ReviewModel')
const handler=require('express-async-handler')
reviewApp.post('/review',handler(async(req,res)=>{
    let p=req.body;
    let r=new  Review(p);
    let r1=await r.save();
    res.status(201).send({message:"reviews posted",payload:r1})
}))
reviewApp.get('/reviews',handler(async(req,res)=>{
      let r=await  Review.findOne({isReviewActive:true})
    res.status(200).send({message:"getting reviews",payload:r})
}))
reviewApp.get("/reviews/:productId", handler(async (req, res) => {
    let { productId } = req.params;
    let reviews = await Review.find({ productId }).populate("userId", "fullname email");
    res.status(200).send({ message: "Product reviews fetched", payload: reviews });
}));

// Get reviews by user
reviewApp.get("/reviews/user/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let reviews = await Review.find({ userId }).populate("productId", "title images");
    res.status(200).send({ message: "User reviews fetched", payload: reviews });
}));


reviewApp.put("/review/:reviewId", handler(async (req, res) => {
    let { reviewId } = req.params;
    let updates = req.body;
    let updatedReview = await Review.findByIdAndUpdate(reviewId, updates, { new: true });
    res.status(200).send({ message: "Review updated", payload: updatedReview });
}));

reviewApp.delete("/review/:reviewId", handler(async (req, res) => {
    let { reviewId } = req.params;
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    res.status(200).send({ message: "Review deleted", payload: deletedReview });
}));
module.exports=reviewApp;

