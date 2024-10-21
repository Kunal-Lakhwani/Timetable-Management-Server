// const Professor = require('../models/professorModel');

// // Create new professor
// exports.createProfessor = async (req, res) => {
//   const { firstName, middleName, lastName, slotIndex, isActive } = req.body;
//   const professor = new Professor({
//     firstName,
//     middleName,
//     lastName,
//     slotIndex,
//     joinedTimestamp: new Date(),
//     isActive
//   });
//   try {
//     const savedProfessor = await professor.save();
//     res.status(201).json(savedProfessor);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all professors
// exports.getAllProfessors = async (req, res) => {
//   try {
//     console.log(req)
//     const professors = await Professor.find();
//     res.status(200).json(professors);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get professor by ID
// exports.getProfessorById = async (req, res) => {
//   try {
//     const professor = await Professor.findById(req.params.id);
//     if (!professor) {
//       return res.status(404).json({ message: 'Professor not found' });
//     }
//     res.status(200).json(professor);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update professor
// exports.updateProfessor = async (req, res) => {
//   const { firstName, middleName, lastName, slotIndex, isActive } = req.body;
//   try {
//     const updatedProfessor = await Professor.findByIdAndUpdate(req.params.id, {
//       firstName,
//       middleName,
//       lastName,
//       slotIndex,
//       isActive
//     }, { new: true });
//     res.status(200).json(updatedProfessor);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete professor
// exports.deleteProfessor = async (req, res) => {
//   try {
//     await Professor.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'Professor deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };







// new changes


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
    const professors = await Professor.find().populate('department');
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
    const newProfessor = new Professor(req.body);
    const OccupiedInfo = await OccupiedSlot.find();
    
    // If there is no info, it means this is the first professor ever.
    if ( OccupiedInfo.length === 0 ){
      // 6 days of week
      for (let i = 1; i <= 6; i++) {
        // 10 periods
        for(let j=1; j <= 10; j++){
          OccupiedInfo.push(new OccupiedSlot({ Day: i, SlotNo: j, AssignedProfs: []}));
        }
      }
      await OccupiedSlot.bulkSave(OccupiedInfo);
    }
    newProfessor.slotIndex = OccupiedInfo[0].AssignedProfs.length
    const savedProfessor = await newProfessor.save();
    await OccupiedSlot.updateMany({},{ $push: { AssignedProfs: false } })
    res.status(201).json(savedProfessor);
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
      let update = {}
      update[`AssignedProfs.${deletedProfessor.slotIndex}`] = ""
      await OccupiedSlot.updateMany({},{$unset: update})  // Sets the slot of this Prof as null.
      await OccupiedSlot.updateMany({},{$pull: {AssignedProfs: null}})  // Removes all null values.
      // Update Professor records to match new slot indexes
      await Professor.updateMany({slotIndex: { $gt: deletedProfessor.slotIndex }, status: "active"},
                                 { $inc: { slotIndex: -1 } })
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
    // Update OccupiedSlots table to remove this prof's field
    let update = {}
    update[`AssignedProfs.${deletedProfessor.slotIndex}`] = ""
    await OccupiedSlot.updateMany({},{$unset: update})  // Sets the slot of this Prof as null.
    await OccupiedSlot.updateMany({},{$pull: {AssignedProfs: null}})  // Removes all null values.
    // Update Professor records to match new slot indexes
    await Professor.updateMany({slotIndex: { $gt: deletedProfessor.slotIndex }, status: "active"},
                               { $inc: { slotIndex: -1 } })
    res.status(200).json({ message: 'Professor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting professor', error });
  }
};
