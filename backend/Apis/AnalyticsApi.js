// //in this we will use mongodb aggregate functions 
// const exp = require('express')
// const express_async_handler = require('express-async-handler')
// const Order = require('../Models/OrderModel.js')
// const analytics_app = exp.Router()
// //apis 
// analytics_app('/top-categories',express_async_handler(async(req,res)=>{
//     const insights = await Order.aggregate([
//         {$match:{status:"completed",isOrderActive:true}}
        
//     ])
// }))