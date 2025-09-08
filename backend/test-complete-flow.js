const mongoose = require('mongoose');
const orderModel = require('./Models/OrderModel');
const productModel = require('./Models/ProductModel');
const userModel = require('./Models/UsersModel');
require('dotenv').config();

async function testCompleteFlow() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Create test seller
    const seller = new userModel({
      fullname: 'Test Seller',
      email: 'seller@test.com',
      password: 'password123',
      role: 'seller'
    });
    await seller.save();
    console.log('Created seller:', seller._id);

    // Create test buyer
    const buyer = new userModel({
      fullname: 'Test Buyer',
      email: 'buyer@test.com',
      password: 'password123',
      role: 'buyer'
    });
    await buyer.save();
    console.log('Created buyer:', buyer._id);

    // Create test product
    const product = new productModel({
      title: 'Test Handmade Product',
      description: 'A beautiful handmade item',
      price: 500,
      category: 'Handmade',
      images: ['/uploads/test-image.jpg'],
      userId: seller._id
    });
    await product.save();
    console.log('Created product:', product._id);

    // Create test order (simulating buyer purchase)
    const order = new orderModel({
      items: [{
        productId: product._id,
        quantity: 2
      }],
      totalAmount: product.price * 2,
      shippingAddress: '123 Test Street, Test City',
      customerName: 'Test Buyer',
      userId: buyer._id,
      buyerId: buyer._id
    });
    await order.save();
    console.log('Created order:', order._id);

    // Test seller orders API logic
    console.log('\n--- Testing Seller Orders API ---');
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

    // Filter for seller orders
    const sellerOrders = orders.filter(order => {
      if (!order.items || !Array.isArray(order.items)) {
        console.log('Order has no items or items is not array:', order._id);
        return false;
      }
      
      return order.items.some(item => {
        if (!item.productId || !item.productId.userId) {
          console.log('Item has no productId or userId:', item);
          return false;
        }
        return item.productId.userId.toString() === seller._id.toString();
      });
    });

    console.log('Seller orders after filtering:', sellerOrders.length);
    
    if (sellerOrders.length > 0) {
      console.log('✅ SUCCESS: Seller orders found!');
      console.log('Order details:', {
        orderId: sellerOrders[0]._id,
        buyer: sellerOrders[0].buyerId?.fullname,
        totalAmount: sellerOrders[0].totalAmount,
        items: sellerOrders[0].items.length
      });
    } else {
      console.log('❌ FAILED: No seller orders found');
    }

    // Test buyer orders API logic
    console.log('\n--- Testing Buyer Orders API ---');
    const buyerOrders = await orderModel.find({ 
      $or: [
        { userId: buyer._id },
        { buyerId: buyer._id }
      ]
    }).populate('items.productId');
    
    console.log('Buyer orders found:', buyerOrders.length);
    
    if (buyerOrders.length > 0) {
      console.log('✅ SUCCESS: Buyer orders found!');
      console.log('Order details:', {
        orderId: buyerOrders[0]._id,
        totalAmount: buyerOrders[0].totalAmount,
        items: buyerOrders[0].items.length
      });
    } else {
      console.log('❌ FAILED: No buyer orders found');
    }

    console.log('\n--- Test Complete ---');
    console.log('Database now has:');
    console.log('- 1 seller user');
    console.log('- 1 buyer user');
    console.log('- 1 product');
    console.log('- 1 order');
    console.log('\nYou can now test the UI with these accounts:');
    console.log('Seller: seller@test.com / password123');
    console.log('Buyer: buyer@test.com / password123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testCompleteFlow();
