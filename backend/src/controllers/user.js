const mongoose = require("mongoose")
const UserAccount = require("../models/UserAccount")
const { body, query } = require('express-validator');
const InformErr = require("../utils/informErr")
const UserImage = require("../models/UserImage")


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
      regularUser: {
        email: 1,
        firstName: 1,
        lastName: 1,
        image: {
          _id: 1
        }
      },
      admin: {
        isActive: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        phone: 1,
        image: {
          _id: 1
        }
      },
    }

    const currentFields = roleFields[req.user.role];


    const limit = req.query.limit;
    const page = req.query.page;
    const offset = limit * page - limit;


    const users = await UserAccount.aggregate([
      { $match: { "_id": { "$ne": mongoose.Types.ObjectId.createFromHexString(req.user.id) } } },
      {
        $lookup: {
          from: 'userimages',
          localField: '_id',
          foreignField: 'userAccountId',
          as: 'image'
        }
      },
      { $unwind: "$image" },
      {
        $project: { ...currentFields, createdAt: 1 }
      },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(offset) },
      { $limit: parseInt(limit) }
    ])

    
    for(let i = 0; i < users.length; ++i){
      users[i].imgUrl = `${process.env.BACKEND_URL}/v1/photos/${users[i].image._id}`

      delete users[i].image
    }



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


    const result = await UserAccount.findByIdAndUpdate(id, inputs, { new: true, select: "_id email firstName lastName phone" })


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


    await UserImage.findOneAndDelete({ userAccountId: id })

    await UserAccount.findByIdAndDelete(id)


    res.status(200).json({
      success: true,
      result: {}
    });

  } catch (err) {
    next(err)
  }
}