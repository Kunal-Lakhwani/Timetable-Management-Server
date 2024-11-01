const TimetableInfo = require('../models/timetableInfoModel');
const Timetable = require('../models/Timetable');
const Group = require('../models/group');
const Subject = require("../models/subjectModel");
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

const GetSubjectsInTimetable = async (timetable) => {
  const flattenedSubjects = timetable.Subjects.flat()
  const records = await Subject.find({ _id: { $in: flattenedSubjects } }).populate("theory_professors practical_professors")
  const recordDict = {}
  for (let i = 0; i < records.length; i++) {
    recordDict[records[i]._id] = records[i]
  }
  return timetable.Subjects.map( subjGrp => subjGrp.map( subID => recordDict[subID] ) )
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
  const { AcademicYearID, semester, subjects } = req.body;
  try{    
    const newTimetable = new Timetable({ AcademicYear: AcademicYearID, Semester: semester, Subjects: subjects })
    const savedTimetable = await newTimetable.save();
    try{
        // If new timetable created, initialise it's info.
        const TimetableDetails = [];
        // 6 days of week
        for (let i = 1; i <= 6; i++) {
          // 10 periods
          for(let j=1; j <= 10; j++){
            TimetableDetails.push(new TimetableInfo( {
              Timetable: savedTimetable._id,
              Day: i,
              SlotNo: j,
              Type: 0,
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

// Get timetable entry by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json({
      _id: timetable._id,
      AcademicYear: timetable.AcademicYear,
      Semester: timetable.Semester,
      Subjects: await GetSubjectsInTimetable(timetable)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get timetable entry by AcademicYear ID params = YearID
exports.getTimetablesByYearId = async (req, res) => {
  try {
    const timetablesStruct = await Timetable.find({ AcademicYear: req.params.YearID });
    if (!timetablesStruct) {
      return res.status(404).json({ message: 'Timetables for specified year not found' });
    }
    const timetables = Promise.all(
      timetablesStruct.map( async (timetable) => {        
        return {
          _id: timetable._id,
          AcademicYear: timetable.AcademicYear,
          Semester: timetable.Semester,
          Subjects: await GetSubjectsInTimetable(timetable)
        }
      } )
    )
    res.status(200).json(await timetables);
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
