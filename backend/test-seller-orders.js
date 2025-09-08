const mongoose = require('mongoose');
const orderModel = require('./Models/OrderModel');
require('dotenv').config();

async function testSellerOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    
    const sellerId = '68bdf9754a46e867414c71e4'; // Test seller ID
    
    const orders = await orderModel.find()
      .populate('buyerId', 'fullname email')
      .populate({
        path: 'items.productId',
        populate: {
          path: 'userId',
          select: 'fullname email'
        }
      })
      .lean();
    
    console.log('Total orders found:', orders.length);
    
    const sellerOrders = orders.filter(order => {
      if (!order.items || !Array.isArray(order.items)) {
        return false;
      }
      
      return order.items.some(item => {
        if (!item.productId || !item.productId.userId) {
          return false;
        }
        console.log('Checking item product userId:', item.productId.userId.toString(), 'against seller:', sellerId);
        return item.productId.userId.toString() === sellerId;
      });
    });
    
    console.log('Seller orders after filtering:', sellerOrders.length);
    
    if (sellerOrders.length > 0) {
      console.log('First order details:');
      console.log('- Order ID:', sellerOrders[0]._id);
      console.log('- Buyer:', sellerOrders[0].buyerId?.fullname);
      console.log('- Total Amount:', sellerOrders[0].totalAmount);
      console.log('- Items:', sellerOrders[0].items.length);
      console.log('- First item product:', sellerOrders[0].items[0].productId?.title);
      console.log('- First item price:', sellerOrders[0].items[0].productId?.price);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}
testSellerOrders();
