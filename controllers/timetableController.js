const TimetableInfo = require('../models/timetableInfoModel');
const Timetable = require('../models/Timetable');
const Group = require('../models/group');
const Subject = require("../models/subjectModel");
const OccupiedSlots = require('../models/OccupiedSlots');

const formatSlotInfo = ( slotInfo ) => {
  return {
    "ID": slotInfo._id,
    "Slot": slotInfo.SlotNo,
    "Type": slotInfo.Type,
    "Subjects": slotInfo.Subjects,
    "Groups": slotInfo.Group
  }
}

const foarmatAndRemoveRedundantSlots = (infoArr, day) => {
  let prevType = -1
  const retArr = infoArr.filter( (info) => { return info.Day === day } ).map((info) => {
    if( prevType === 1 ){
      prevType = -1
      return null;
    }
    prevType = info.Type
    return formatSlotInfo(info)
  }).filter(info => info !== null);
  return retArr
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
    const Table = await Timetable.findById(TimetableID);
    const Groups = await Group.find( { Timetable: TimetableID } ).populate("Labs.Subject").populate("Labs.Professor").populate("Labs.Lab");
    const TimetableDetails = await TimetableInfo.find({ Timetable: TimetableID }).populate("Subjects", "_id Abbreviation").populate("Group", "_id Name");
    const OccupiedSlotInfo = await OccupiedSlots.find()
    formattedSlotInfo = {
      "Monday": foarmatAndRemoveRedundantSlots(TimetableDetails, 1),
      "Tuesday": foarmatAndRemoveRedundantSlots(TimetableDetails, 2),
      "Wednesday": foarmatAndRemoveRedundantSlots(TimetableDetails, 3),
      "Thursday": foarmatAndRemoveRedundantSlots(TimetableDetails, 4),
      "Friday": foarmatAndRemoveRedundantSlots(TimetableDetails, 5),
      "Saturday": foarmatAndRemoveRedundantSlots(TimetableDetails, 6)
    }
    const subjects = await GetSubjectsInTimetable(Table)
    const LecturesInfo = subjects.map( subjgrp => {      
      return {
        IDs: subjgrp.map( subj => subj._id ),
        Name: subjgrp.map( subj => subj.Abbreviation ).join("/"),
        TotalLectures: subjgrp[0].credit_hours,
        LecturesLeft: subjgrp[0].credit_hours,
      }
    })
    const GroupsInfo = Groups.map( grp => {  
      const data = grp._doc
      return { ...data, Labs: data.Labs.map( lab => {return { ...lab._doc, Assigned: false }} ) }
    })
    // With the initial blank values set, we now need to map a dictionary for LecturesInfo. 
    // where key is ID and value is the object record.
    const LecturesDict = {}
    LecturesInfo.forEach( (lecture, lectureIdx) => {
      lecture.IDs.forEach( subjID => {
        LecturesDict[subjID] = lectureIdx
      })
    })
    // Because we are storing reference to lecture rather than a copy, when one grouped subject is 
    // edited, the other is too.

    const GroupsDict = {}
    GroupsInfo.forEach( ( grp, grpIdx ) => GroupsDict[grp._id] = grpIdx )

    // Now, we loop through all TimetableInfo records and modify the GroupsInfo and LecturesInfo data
    // Through their dicitonaries

    let skipOne = false 
    // If previous slot was lab, we need to skip the next slot
    // This is because lab takes two slots
    TimetableDetails.forEach( info => {
      if (skipOne){
        skipOne = false;
      }
      else{
        info.Subjects.forEach(( subjInfo, subjIdx ) => {
          if ( info.Type === 0 ){ // If theory Lecture
            LecturesInfo[LecturesDict[subjInfo._id]].LecturesLeft -= 1; // Deduct a lecture count
          }
          else{ // If Lab
            skipOne = true
            const recordIdx = GroupsDict[ info.Group[subjIdx]._id ]
            GroupsInfo[recordIdx].Labs.forEach( ( lab, labIdx ) => {
              if ( lab.Subject._id.equals(subjInfo._id) ){
                GroupsInfo[recordIdx].Labs[labIdx].Assigned = true
              }
            })
          }
        })
      }
    })

    const payload = {
      Subjects: subjects,
      Lectures: LecturesInfo,
      Groups: GroupsInfo,
      LecturesDict: LecturesDict,
      GroupsDict: GroupsDict,
      TimetableInfo: formattedSlotInfo,
      OccupiedSlots: OccupiedSlotInfo
    }
    res.status(200).json(payload);
  }
  catch (err){
    console.log(err)
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
  try {
    const updatedTimetable = await TimetableInfo.findByIdAndUpdate(req.params.id, {
      Day: day,
      SlotNo: slotNo,
      Type: type,
      Subjects: subjects,
      Group: groups.filter( grpID => grpID !== "" )
    }, { new: true });    
    console.log(updatedTimetable)
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
