const exp=require('express')
const cartApp=exp.Router();
const Cart=require('../Models/CartModel')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const handler=require('express-async-handler')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
cartApp.post('/cart', authenticate, handler(async(req,res)=>{
    try {
        const { items } = req.body;
        const userId = req.user.id;
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).send({ message: "Items array is required" });
        }
        
        // Find existing cart or create new one
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            // Create new cart if none exists
            cart = new Cart({ userId, items: [] });
        }
        
        // Add new items to existing cart
        for (const newItem of items) {
            const existingItemIndex = cart.items.findIndex(
                item => item.productId.toString() === newItem.productId
            );
            
            if (existingItemIndex >= 0) {
                // Update quantity if item already exists
                cart.items[existingItemIndex].quantity += newItem.quantity || 1;
            } else {
                // Add new item to cart
                cart.items.push({
                    productId: newItem.productId,
                    quantity: newItem.quantity || 1
                });
            }
        }
        
        const savedCart = await cart.save();
        res.status(201).send({ message: "Items added to cart successfully", payload: savedCart });
    } catch (error) {
        console.error('Cart error:', error);
        res.status(500).send({ message: "Failed to add items to cart", error: error.message });
    }
}));
cartApp.get('/carts',handler(async(req,res)=>{
    let r=await Cart.findOne({iscartActive:true})
    res.status(200).send({message:"getting carts",payload:r})
}));
cartApp.get("/cart/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    
    // Validate ObjectId format first
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ message: "Invalid user ID format" });
    }
    
    // Then authenticate
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).send({ message: 'Missing token' })
    
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).send({ message: 'Invalid or expired token' })
    }
    
    // Allow users to fetch only their own cart (both buyers and sellers)
    if (decoded.id !== userId) return res.status(403).send({ message: "Forbidden" })
    
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).send({ message: "Cart not found" });
    res.status(200).send({ message: "Cart fetched", payload: cart });
}));
cartApp.put("/cart/:userId", authenticate, handler(async (req, res) => {
    let { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).send({ message: "Forbidden" })
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ message: "Invalid user ID format" });
    }
    
    let updates = req.body;  
    let updatedCart = await Cart.findOneAndUpdate({ userId }, updates, { new: true });
    res.status(200).send({ message: "Cart updated", payload: updatedCart });
}));

// Update cart item quantity
cartApp.put("/cart/:userId/item/:productId", authenticate, handler(async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    if (req.user.id !== userId) return res.status(403).send({ message: "Forbidden" });
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send({ message: "Invalid ID format" });
    }
    
    if (quantity < 1) {
        return res.status(400).send({ message: "Quantity must be at least 1" });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send({ message: "Cart not found" });
    
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).send({ message: "Item not found in cart" });
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.status(200).send({ message: "Item quantity updated", payload: cart });
}));

// Remove item from cart
cartApp.delete("/cart/:userId/item/:productId", authenticate, handler(async (req, res) => {
    const { userId, productId } = req.params;
    
    if (req.user.id !== userId) return res.status(403).send({ message: "Forbidden" });
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send({ message: "Invalid ID format" });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send({ message: "Cart not found" });
    
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    
    res.status(200).send({ message: "Item removed from cart", payload: cart });
}));


cartApp.delete("/cart/:userId", authenticate, handler(async (req, res) => {
    let { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).send({ message: "Forbidden" })
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ message: "Invalid user ID format" });
    }
    
    let deleted = await Cart.findOneAndDelete({ userId });
    res.status(200).send({ message: "Cart deleted", payload: deleted });
}));

module.exports=cartApp;