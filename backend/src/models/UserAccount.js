const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null,
    required: false,
  },
  firstName: {
    type: String,
    default: null,
    required: false,
  },
  lastName: {
    type: String,
    default: null,
    required: false,
  },
  phone: {
    type: String,
    default: null,
    required: false,
  },
  userRoleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRole',
    default: "680f26b33bc92ec34a17db22",  // regularUser
    required: true
  },


}, { timestamps: true });


module.exports = mongoose.model("UserAccount", schema);