const { body, query } = require('express-validator');
const jwt = require("jsonwebtoken");
const InformErr = require("../utils/informErr")
const UserAccount = require("../models/UserAccount")
const UserImage = require("../models/UserImage")



exports.validate = {
  imageUpload: [
    body("token").notEmpty(),
  ],
}



exports.imageUpload = async (req, res, next) => {
  try {
    const token = req.body.token;

    const decoded = jwt.verify(token, process.env.INVITATION_TK_JWT_SECRET);


    const user = await UserAccount.findOne({ email: decoded.email }, "_id")


    const obj = {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      data: req.file.buffer,
      userAccountId: user._id
    };


    const image = await UserImage.create(obj);

    const url = `${process.env.BACKEND_URL}/v1/photos/${image._id}`;


    res.status(200).json({
      success: true,
      result: {
        url
      }
    });

  } catch (err) {
    next(err)
  }
}




exports.getImage = async (req, res, next) => {
  try {
    const id = req.params.id;

    const image = await UserImage.findById(id);

    res.set('Content-Type', image.mimetype);
    res.send(image.data);

  } catch (err) {
    next(err)
  }
}