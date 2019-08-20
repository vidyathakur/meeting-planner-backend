/**
 * Module Dependencies
 */
const mongoose = require('mongoose')
Schema = mongoose.Schema;

let eventsSchema = new Schema({
  userId: {
    type: String,
    default: ''
  },
  meetId:{
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  meetingWith:{
    type: String,
    default: ''
  },
  meetingPlace:{
    type: String,
    default: ''
  },
  startTime: {
    type: Date,
    default: ''
  },
  endTime: {
    type: Date,
    default: ''
  },
  createdOn :{
    type:Date,
    default:""
  }


})

mongoose.model('Events', eventsSchema);