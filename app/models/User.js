
/**
 * Module Dependencies
 */
const mongoose = require('mongoose')
Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  parentId: {
    type: String,
    default: ''
  },

  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: 'passskdajakdjkadsj'
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: String,
    default: ''
  },
  CountryCode:{
    type: String,
    default:''
  },
  shortCode:{
    type: String,
    default:''
  },
  isLogin:{
    type: String,
    default: 0
  },
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('User', userSchema);
