const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  userAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAccount',
    required: true
  },


}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});


module.exports = mongoose.model("BlacklistRefreshToken", schema);