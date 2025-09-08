const exp=require('express')
const orderApp=exp.Router();
const orderModel=require('../Models/OrderModel')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const handler=require('express-async-handler')
orderApp.post('/order', authenticate, handler(async(req,res)=>{
    try {
        const { items, totalAmount, shippingAddress, customerName } = req.body;
        
        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).send({ message: "Items are required" });
        }
        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).send({ message: "Valid total amount is required" });
        }
        if (!shippingAddress || !customerName) {
            return res.status(400).send({ message: "Shipping address and customer name are required" });
        }
        
        const order = new orderModel({ 
            items,
            totalAmount,
            shippingAddress,
            customerName,
            userId: req.user.id,
            buyerId: req.user.id
        });
        
        const savedOrder = await order.save();
        res.status(201).send({message:"Order created successfully", payload: savedOrder});
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({message:"Failed to create order", error: error.message});
    }
}))
orderApp.get('/orders', authenticate, handler(async(req,res)=>{
      let r=await orderModel.find({ userId: req.user.id })
        .populate("items.productId")
        .populate({
            path: "items.productId",
            populate: {
                path: "userId",
                select: "fullname email"
            }
        });
    res.status(200).send({message:"getting orders",payload:r})
}))

// Get orders for sellers (orders containing their products)
orderApp.get('/orders/seller', authenticate, authorizeRoles('seller'), handler(async(req,res)=>{
    try {
        console.log('Fetching seller orders for user:', req.user.id);
        
        // Find orders that contain products from this seller
        const orders = await orderModel.find()
            .populate('buyerId', 'fullname email')
            .populate({
                path: 'items.productId',
                populate: {
                    path: 'userId',
                    select: 'fullname email'
                }
            })
            .lean()
        
        console.log('Total orders found:', orders.length);
        
        // Filter orders to only include those with products from this seller
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
                const productUserId = item.productId.userId._id ? item.productId.userId._id.toString() : item.productId.userId.toString();
                console.log('Checking item product userId:', productUserId, 'against seller:', req.user.id);
                return productUserId === req.user.id;
            });
        });
        
        console.log('Seller orders after filtering:', sellerOrders.length);
        
        // Log the first order for debugging
        if (sellerOrders.length > 0) {
            console.log('First seller order:', JSON.stringify(sellerOrders[0], null, 2));
        }
        
        res.status(200).send({message:"Seller orders fetched",payload:sellerOrders})
    } catch (error) {
        console.error('Error fetching seller orders:', error)
        res.status(500).send({message:"Failed to fetch seller orders", error: error.message})
    }
}))

orderApp.get("/orders/:userId", authenticate, handler(async (req, res) => {
    let { userId } = req.params;
    if (req.user.role === 'buyer' && req.user.id !== userId) return res.status(403).send({ message: 'Forbidden' })
    let orders = await orderModel.find({ userId })
        .populate("items.productId")
        .populate({
            path: "items.productId",
            populate: {
                path: "userId",
                select: "fullname email"
            }
        });
    res.status(200).send({ message: "Orders fetched", payload: orders });
}));


orderApp.put("/order/:orderId", authenticate, handler(async (req, res) => {
    let { orderId } = req.params;
    let updates = req.body; 
    let updatedOrder = await orderModel.findByIdAndUpdate(orderId, updates, { new: true });
    res.status(200).send({ message: "Order updated", payload: updatedOrder });
}));

// Update order status (for sellers)
orderApp.put("/orders/:orderId/status", authenticate, authorizeRoles('seller'), handler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).send({ message: "Status is required" });
        }
        
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ message: "Invalid status" });
        }
        
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        ).populate('buyerId', 'fullname email').populate('items.productId');
        
        if (!updatedOrder) {
            return res.status(404).send({ message: "Order not found" });
        }
        
        res.status(200).send({ message: "Order status updated", payload: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send({ message: "Failed to update order status", error: error.message });
    }
}));

orderApp.delete("/order/:orderId", authenticate, handler(async (req, res) => {
    let { orderId } = req.params;
    let deletedOrder = await orderModel.findByIdAndDelete(orderId);
    res.status(200).send({ message: "Order cancelled", payload: deletedOrder });
}));

// Cleanup endpoint to remove old malformed orders
orderApp.delete("/cleanup-orders", authenticate, authorizeRoles('seller'), handler(async (req, res) => {
    try {
        console.log('Starting cleanup of old orders...');
        
        // Find orders that don't have items array or have empty items
        const malformedOrders = await orderModel.find({
            $or: [
                { items: { $exists: false } },
                { items: { $size: 0 } },
                { products: { $exists: true } } // Old schema orders
            ]
        });
        
        console.log(`Found ${malformedOrders.length} malformed orders to delete`);
        
        if (malformedOrders.length > 0) {
            const deleteResult = await orderModel.deleteMany({
                $or: [
                    { items: { $exists: false } },
                    { items: { $size: 0 } },
                    { products: { $exists: true } }
                ]
            });
            
            console.log(`Deleted ${deleteResult.deletedCount} malformed orders`);
            res.status(200).send({ 
                message: "Cleanup completed", 
                deletedCount: deleteResult.deletedCount 
            });
        } else {
            res.status(200).send({ 
                message: "No malformed orders found", 
                deletedCount: 0 
            });
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).send({ message: "Cleanup failed", error: error.message });
    }
}));

module.exports=orderApp;