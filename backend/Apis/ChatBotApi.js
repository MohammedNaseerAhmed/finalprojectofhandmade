const exp = require('express')
const express_async_handler = require('express-async-handler')
const chat_app = exp.Router();
const Product = require('../Models/ProductModel.js');
require('dotenv').config()
const GROQ = require('groq-sdk')
const groq = new GROQ({apikey:process.env.GROQ_API_KEY})
//api for chat bot and this chat bot remebers only 1 previous message only beacuse free tier limits tokens 

chat_app.post("/",express_async_handler(async(req,res)=>{
    const {query} = req.body;

    const prompt = `you are an shopping assitant about hand made products made by art students or small art buissness owners.
    and extract the product  category and price limit from the user category:${query} .
    Return the result in Strict Json format like:
    {
    "category":"category name",
    "price":number or null
    }
    if category or price is not mentioned then return them as null.
    only return json do not return any explanation`;
    const aiResponse = await groq.chat.completions.create({
        model:"llama-3.3-70b-versatile",
        messages:[{role:"user",content:prompt}]
    })
    const parsed = JSON.parse(aiResponse.choices[0].message.content)
    const category = parsed.category;
    const pricelimit = parsed.price;
    let filter = {isProductActive:true}
    if(category){
        filter.category = new RegExp(category,"i");
    }
    if(pricelimit){
        filter.price = {$lte:pricelimit}
    }
    const products = await Product.find(filter).limit(5);
    if(products.length == 0){
      return  res.status(200).send({message:"no products matched your search",payload:[]})
    }
    const formatted_products = products.map(p=>({
            title:p.title,
            category:p.category,
            price: p.price,
            description: p.description,
            images: p.images,
            featured: p.featured,
            isProductActive: p.isProductActive,
            useGROQ: p.useGROQ
    }))
    res.status(200).send({message:"ai chatbot is talking",payload:formatted_products})
}))
//exporting 
module.exports = chat_app;
