const TimetableInfo = require('../models/timetableInfoModel');
const Timetable = require('../models/TimetableModel');
const Group = require('../models/group');
const OccupiedSlots = require('../models/OccupiedSlots');

const formatSlotInfo = ( slotInfo ) => {
  return {
    "ID": slotInfo._id,
    "Slot": slotInfo.slotNo,
    "Type": slotInfo.type,
    "Subjects": slotInfo.subjects,
    "Groups": slotInfo.groupId
  }
}

const removeRedundantSlots = (infoArr, day) => {
  let prevType = 0
  return infoArr.filter( (info) => { return info.day === day } ).map((info) => {
      if( prevType === 1 ){
        prevType = 0
        return null;
      }
      prevType = info.type
      return formatSlotInfo(info)
    }).filter(info => info !== null);
}

// Get detailed info for a timetable
exports.getDetailedTimetableInfo = async (req,res) => {
  try{
    const TimetableID = req.params.id;
    const Table = await Timetable.findById(TimetableID).populate("Subjects");
    const Groups = await Group.find( { department: Table.deptID, semester: Table.Semester } );
    const TimetableDetails = await TimetableInfo.find({ timetableID: TimetableID }).populate("subjects", "Abbreviation").populate("groupId", "groupName");
    const OccupiedSlotInfo = await OccupiedSlots.find();
    formattedSlotInfo = {
      "Monday": removeRedundantSlots(TimetableDetails, 1),
      "Tuesday": removeRedundantSlots(TimetableDetails, 2),
      "Wednesday": removeRedundantSlots(TimetableDetails, 3),
      "Thursday": removeRedundantSlots(TimetableDetails, 4),
      "Friday": removeRedundantSlots(TimetableDetails, 5),
      "Saturday": removeRedundantSlots(TimetableDetails, 6)
    }
    const payload = {
      Subjects: Table.Subjects,
      Groups: Groups,
      TimetableInfo: formattedSlotInfo,
      OccupiedSlots: OccupiedSlotInfo
    }
    res.status(200).json(payload);
  }
  catch (err){
    res.status(500).json({ message: err.message });
  }
}

// Create a new Timetable
exports.createTimetable = async (req,res) => {
  const { deptID, semester, subjects } = req.body;
  try{    
    const newTimetable = new Timetable({ deptID: deptID, Semester: semester, Subjects: subjects  })
    const savedTimetable = await newTimetable.save();
    try{
        // If new timetable created, initialise it's info.
        const TimetableDetails = [];
        // 6 days of week
        for (let i = 1; i <= 6; i++) {
          // 10 periods
          for(let j=1; j <= 10; j++){
            TimetableDetails.push(new TimetableInfo( {
              timetableID: savedTimetable._id,
              day: i,
              slotNo: j,
              type: 0,
            } ));
          }
        }
        await TimetableInfo.insertMany(TimetableDetails);
    }
    catch(ex){
      await Timetable.findByIdAndDelete(savedTimetable._id);
      console.log(ex.message);
      res.status(500).json({ message: ex.message });
    }
    res.status(200).json(savedTimetable);
  }
  catch(ex){
    console.log(ex.message);
    res.status(500).json({ message: ex.message })
  }
}

// Get all timetable entries
exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().populate('deptID').populate('Subjects');
    res.status(200).json(timetables);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get timetable entry by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id).populate('Subjects');
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update timetable
exports.updateTimetable = async (req, res) => {
  const { deptId, semester, subjects } = req.body;
  try {
    const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, {
      deptId,
      semester,
      subjects
    }, { new: true });
    res.status(200).json(updatedTimetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update timetable slot Info
exports.updateTimetableInfo = async (req, res) => {
  const { day, slotNo, subjects, type, groups } = req.body;
  console.log(req.body)
  try {
    console.log(req.params.id);
    const updatedTimetable = await TimetableInfo.findByIdAndUpdate(req.params.id, {
      day: day,
      slotNo: slotNo,
      type: type,
      subjects: subjects,
      groupId: groups
    }, { new: true });    
    console.log(updatedTimetable);
    res.status(200).json(updatedTimetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete timetable entry
exports.deleteTimetable = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Timetable entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
