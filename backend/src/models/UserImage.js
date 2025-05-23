const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  userAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAccount',
    required: true
  },


}, { timestamps: false });


module.exports = mongoose.model("UserImage", schema);