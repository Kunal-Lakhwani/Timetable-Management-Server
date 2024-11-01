const mongoose = require('mongoose')

const OccupiedSlotsSchema = new mongoose.Schema({
	Day: {
        type: Number,
        required: true
    },
	SlotNo: {
        type: Number,
        requred: true
    },
	AssignedProfs: {
        type: [mongoose.Schema.Types.Mixed],
        ref: 'TimetableInfo'
    }
})

const OccupiedSlots = mongoose.model("OccupiedSlots", OccupiedSlotsSchema)
module.exports = OccupiedSlots