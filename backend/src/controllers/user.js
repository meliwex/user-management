const UserAccount = require("../models/UserAccount")
const { body, query } = require('express-validator');
const InformErr = require("../utils/informErr")


exports.validate = {
  updateUser: [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("phone").notEmpty(),
  ],
}

exports.getUsers = async (req, res, next) => {
  try {
    const roleFields = {
      regularUser: "email firstName lastName imgUrl",
      admin: "isActive email firstName lastName phone imgUrl",
    }

    const currentFields = roleFields[req.user.role];


    const limit = req.query.limit;
    const page = req.query.page;
    const offset = limit * page - limit;


    const users = await UserAccount.find({ "_id": { "$ne": req.user.id } }, currentFields).skip(offset).limit(limit).sort({ createdAt: "descending" });

    const count = await UserAccount.countDocuments({ "_id": { "$ne": req.user.id } });

    const totalNumOfPages = Math.ceil(count / limit);


    res.status(200).json({
      success: true,
      totalPages: totalNumOfPages,
      result: users
    });

  } catch (err) {
    next(err)
  }
}



exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await UserAccount.findById(id);

    if (!user) {
      const err = new InformErr("userNotFound", 404);
      return next(err)
    }


    const inputs = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    };


    const result = await UserAccount.findByIdAndUpdate(id, inputs, { new: true, select: "_id email firstName lastName phone imgUrl" })
    

    res.status(200).json({
      success: true,
      result: result 
    });

  } catch (err) {
    next(err)
  }
}



exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await UserAccount.findById(id);

    if (!user) {
      const err = new InformErr("userNotFound", 404);
      return next(err)
    }


    await UserAccount.findByIdAndDelete(id)
    

    res.status(200).json({
      success: true,
      result: {} 
    });

  } catch (err) {
    next(err)
  }
}