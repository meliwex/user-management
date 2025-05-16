const { validationResult } = require('express-validator');
const InformErr = require("./informErr")


const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    const err = new InformErr("badRequest", 400);
    return next(err)


    // return res.status(400).json({
    //   success: false,
    //   errors: errors.array()
    // });
  }


  return next();
}


const validateInput = (validateBodies) => {
  return [...validateBodies, checkValidationResult]
}


module.exports = validateInput; 