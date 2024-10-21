const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Professor', 'Admin'],
    }
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` timestamps
});

const User = mongoose.model('User', userSchema);

module.exports = User;
