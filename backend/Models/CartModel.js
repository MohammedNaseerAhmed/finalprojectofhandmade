const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    iscartActive:{
        type:Boolean,
        default:true
    }
}, { strict: 'throw' });

const Cart = mongoose.model('carts', cartSchema);
module.exports = Cart;
