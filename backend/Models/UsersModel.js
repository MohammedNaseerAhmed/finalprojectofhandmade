const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
        
    },
    email: {
        type: String,
        required: true,
        unique: true, 
      
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum:['buyer','seller'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { strict: 'throw' });

const User = mongoose.model('User', userSchema);
module.exports = User;
