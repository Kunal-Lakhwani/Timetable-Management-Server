const Professor = require('../models/professorModel');
const OccupiedSlot = require('../models/OccupiedSlots')

exports.getOccupiedSlotInfo = async (req, res) => {
  try{
    const SlotInfo = await OccupiedSlot.find();
    res.status(200).json(SlotInfo);
  }
  catch(ex){
    res.status(500).json({ message: 'Error fetching professors', error });
  }
}

exports.deleteAllSlotInfo = async (req, res) => {
  try{
    const SlotInfo = await OccupiedSlot.updateMany({},{$set: {AssignedProfs: []}});
    res.status(200).json(SlotInfo);
  }
  catch(ex){
    res.status(500).json({ message: 'Error fetching professors', error });
  }
}

// Get all professors
exports.getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find().populate('Department');
    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professors', error });
  }
};

// Get a single professor by ID
exports.getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id).populate('department');
    if (!professor) {
      return res.status(404).json({ message: 'Professor not found' });
    }
    res.status(200).json(professor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professor', error });
  }
};

// Create a new professor
exports.createProfessor = async (req, res) => {
  try {
    const {firstName, middleName, lastName, department} = req.body;
    const OccupiedInfo = await OccupiedSlot.find();
    // Initialize if no Info
    if ( OccupiedInfo.length === 0 ){
      // 6 days of week
      for (let i = 1; i <= 6; i++) {
        // 10 periods
        for(let j=1; j <= 10; j++){
          OccupiedInfo.push(new OccupiedSlot({ Day: i, SlotNo: j, AssignedProfs: [""]}));
        }
      }
      await OccupiedSlot.insertMany(OccupiedInfo);
    }
    const newProfessor = new Professor({ FirstName: firstName, MiddleName: middleName, LastName:lastName, Department: department });
    newProfessor.SlotIndex = OccupiedInfo[0].AssignedProfs.length - 1
    const savedProfessor = await newProfessor.save();
    // If professor created successfully, create a new entry for them in AssignedProfs Array
    await OccupiedSlot.updateMany({},{ $push: { AssignedProfs: "" } })
    res.status(200).json(savedProfessor);
  } catch (error) {
    res.status(400).json({ message: 'Error creating professor', error });
  }
};

// Update a professor by ID
exports.updateProfessor = async (req, res) => {
  try {
    const updatedProfessor = await Professor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProfessor) {
      return res.status(404).json({ message: 'Professor not found' });
    }
    if(updatedProfessor.status === "inactive"){
      // Update OccupiedSlots table to remove this prof's field
      await RemoveProfessorSlot(updatedProfessor.SlotIndex)
    }
    res.status(200).json(updatedProfessor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating professor', error });
  }
};

// Delete a professor by ID
exports.deleteProfessor = async (req, res) => {
  try {
    const deletedProfessor = await Professor.findByIdAndDelete(req.params.id);
    if (!deletedProfessor) {
      return res.status(404).json({ message: 'Professor not found' });
    }
    await RemoveProfessorSlot(deletedProfessor.SlotIndex)
    res.status(200).json({ message: 'Professor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting professor', error });
  }
};

const RemoveProfessorSlot = async (deletedslotIndex) => {
  
  const slotInfo = await OccupiedSlot.find({})
  const batchUpdates = slotInfo.map((record) => {
    const modifiedAssignedProfs = record.AssignedProfs.filter(( _, idx ) => idx != deletedslotIndex )
    return {
      updateOne: {
        filter: { _id: record._id },
        update: { $set: { AssignedProfs: modifiedAssignedProfs } }
      }
    }
  })
  await OccupiedSlot.bulkWrite( batchUpdates )
  // Update Professor records to match new slot indexes
  await Professor.updateMany({slotIndex: { $gt: deletedslotIndex }, status: "active"},
                             { $inc: { slotIndex: -1 } })
}