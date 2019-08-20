/**
 * Module Dependencies
 */
const mongoose = require('mongoose')
Schema = mongoose.Schema;

let countrymasterSchema = new Schema({
  countryCode: {
    type: String,
    default: ''
  },
  shortCode: {
    type: Number,
    default: ''
  }
})

mongoose.model('Countrymaster', countrymasterSchema);