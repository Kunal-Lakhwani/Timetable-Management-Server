const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    status: { type: String, enum: ['active', 'archived'], required: true }
});

  
  module.exports = mongoose.model('Department', departmentSchema);