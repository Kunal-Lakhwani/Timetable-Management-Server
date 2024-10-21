const mongoose = require('mongoose')

const OccupiedSlots = new mongoose.Schema({
	Day: {
        type: Number,
        required: true
    },
	SlotNo: {
        type: Number,
        requred: true
    },						
	AssignedProfs: {
        type: [Boolean],
        required: true
    }
})

module.exports = mongoose.model("OccupiedSlots", OccupiedSlots)