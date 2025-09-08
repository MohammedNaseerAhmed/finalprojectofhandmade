const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: {
     type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
      type: String,
        required: true,
    
    },
    useGROQ:{
        type:Boolean,
        default:false
    },
    description: {
        type: String,
      required: true
    },
    category: {
        type: String,
    required: true
    },
    price: {
        type: Number,
        required: true,
     min: 0
    },
    images: [{
        type: String 
    }],
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
    default: Date.now
 },
 isProductActive:{
    type: Boolean,
        default: true
 }
}, { strict: 'throw' });

const Product = mongoose.model('product', productSchema);
module.exports = Product;
