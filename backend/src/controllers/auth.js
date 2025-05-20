const bcrypt = require("bcrypt")
const { body, query } = require('express-validator');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const { v4 } = require('uuid');
const InformErr = require("../utils/informErr")
const UserAccount = require("../models/UserAccount")
const UserRole = require("../models/UserRole")
const BlacklistRefreshToken = require("../models/BlacklistRefreshToken")



exports.validate = {
  register: [
    body("email").notEmpty(),
    query("fields").notEmpty(),
  ],
  login: [
    body("email").notEmpty(),
    body("password").notEmpty(),
    query("fields").notEmpty(),
  ],
  refresh: [
    body("refreshTk").notEmpty(),
  ],
  activateAccount: [
    body("token").notEmpty(),
    body("password").notEmpty(),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("phone").notEmpty(),
  ],
  forgotPassword: [
    body("email").notEmpty(),
  ],
  confirmForgotPassword: [
    body("token").notEmpty(),
    body("newPassword1").notEmpty(),
    body("newPassword2").notEmpty(),
  ]
}


exports.register = async (req, res, next) => {
  try {
    const fields = req.query.fields.split(",")


    const user = await UserAccount.findOne({ email: req.body.email })

    if (user) {
      const err = new InformErr("invitationIsAlreadySent", 400);
      return next(err)
    }


    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASS,
      },
    });



    const token = jwt.sign({ email: req.body.email }, process.env.INVITATION_TK_JWT_SECRET, {
      expiresIn: process.env.INVITATION_TK_JWT_EXPIRY,
    });


    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: req.body.email,
      subject: "Hello from Nodemailer",
      text: `${process.env.FRONTEND_URL}/invitation/${token}`,
    };


    await transporter.sendMail(mailOptions)



    const inputs = {
      email: req.body.email
    };


    let newUser = await UserAccount.create(inputs);

    newUser = newUser.toJSON();
    delete newUser.password;
    delete newUser.userRoleId;
    delete newUser.isActive;



    const result = {};

    for (let i = 0; i < fields.length; ++i) {

      if (newUser[fields[i]] !== undefined) {
        result[fields[i]] = newUser[fields[i]]
      }
    }


    res.status(201).json({
      success: true,
      result: result
    });

  } catch (err) {
    next(err)
  }
}



exports.activateAccount = async (req, res, next) => {
  try {
    const token = req.body.token;

    const decoded = jwt.verify(token, process.env.INVITATION_TK_JWT_SECRET);


    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const imgUrl = req.file?.filename || "default-avatar.jpg";

    const inputs = {
      isActive: true,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      imgUrl: imgUrl
    };

    await UserAccount.updateOne({ email: decoded.email }, inputs);


    res.status(200).json({
      success: true,
      result: {}
    });

  } catch (err) {
    next(err)
  }
}



exports.login = async (req, res, next) => {
  try {
    const fields = req.query.fields.split(",")


    let user = await UserAccount.findOne({ email: req.body.email, isActive: true }).populate('userRoleId');

    const errMsg = "Incorrect email or password";

    if (user === null) {
      const err = new InformErr(errMsg, 400);
      return next(err)
    }


    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch === false) {
      const err = new InformErr(errMsg, 400);
      return next(err)
    }

    
    const accessToken = jwt.sign({ id: user._id, role: user.userRoleId.roleName }, process.env.ACCESS_TK_JWT_SECRET, {
      expiresIn: process.env.ACCESS_TK_JWT_EXPIRY,
    });
    
    const refreshToken = jwt.sign({ id: user._id, role: user.userRoleId.roleName }, process.env.REFRESH_TK_JWT_SECRET, {
      expiresIn: process.env.REFRESH_TK_JWT_EXPIRY,
    });


    const role = user.userRoleId.roleName; 


    user = user.toJSON();
    delete user.password;
    delete user.userRoleId;


    const result = {};

    for (let i = 0; i < fields.length; ++i) {

      if (user[fields[i]] !== undefined) {
        result[fields[i]] = user[fields[i]]
      }
    }


    res.json({
      success: true,
      tokens: {
        accessToken,
        refreshToken
      },
      role: role,
      result: result
    });

  } catch (err) {
    next(err)
  }
}



exports.refresh = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.refreshTk, process.env.REFRESH_TK_JWT_SECRET);


    const isInBlacklist = await BlacklistRefreshToken.findOne({ refreshToken: req.body.refreshTk });

    if (isInBlacklist) {
      const err = new InformErr("");
      return next(err)
    }


    const user = await UserAccount.findById(decoded.id, '_id').populate('userRoleId');

    if (!user) {
      const err = new InformErr("");
      return next(err)
    }


    await BlacklistRefreshToken.create({
      refreshToken: req.body.refreshTk,
      userAccountId: decoded.id
    });


    const accessToken = jwt.sign({ id: decoded.id, role: user.userRoleId.roleName, t: v4() }, process.env.ACCESS_TK_JWT_SECRET, {
      expiresIn: process.env.ACCESS_TK_JWT_EXPIRY,
    });

    const refreshToken = jwt.sign({ id: decoded.id, role: user.userRoleId.roleName, t: v4() }, process.env.REFRESH_TK_JWT_SECRET, {
      expiresIn: process.env.REFRESH_TK_JWT_EXPIRY,
    });


    res.json({
      success: true,
      tokens: {
        accessToken,
        refreshToken
      },
      role: user.userRoleId.roleName,
      result: {}
    });

  } catch (err) {
    next(err)
  }
}




exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await UserAccount.findOne({ email: req.body.email })

    if (!user) {
      return res.status(200).json({
        success: true,
        result: {}
      });
    }


    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASS,
      },
    });


    const token = jwt.sign({ id: user._id }, process.env.FORGOTPASSWORD_TK_JWT_SECRET, {
      expiresIn: process.env.FORGOTPASSWORD_TK_JWT_EXPIRY,
    });


    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: req.body.email,
      subject: "Hello from Nodemailer",
      text: `${process.env.FRONTEND_URL}/forgot-password/${token}`,
    };


    await transporter.sendMail(mailOptions)


    res.status(200).json({
      success: true,
      result: {}
    });

  } catch (err) {
    next(err)
  }
}




exports.confirmForgotPassword = async (req, res, next) => {
  try {
    const token = req.body.token;

    const decoded = jwt.verify(token, process.env.FORGOTPASSWORD_TK_JWT_SECRET);



    if (req.body.newPassword1 !== req.body.newPassword2) {
      const err = new InformErr("");
      return next(err)
    }

    
    const hashedPassword = await bcrypt.hash(req.body.newPassword1, 10);


    const inputs = {
      password: hashedPassword,
    };

    await UserAccount.updateOne({ _id: decoded.id }, inputs);


    res.status(200).json({
      success: true,
      result: {}
    });

  } catch (err) {
    next(err)
  }
}