const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  Name: { type: String, required: true, unique: true },
  Branch: { type: String, required: true }
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department