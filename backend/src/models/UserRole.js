const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
  },


}, { timestamps: false });


module.exports = mongoose.model("UserRole", schema);