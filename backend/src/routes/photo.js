const express = require("express");
const { validate, imageUpload, getImage } = require("../controllers/photo")
const validateInput = require("../utils/validateInput")
const rolesEnum = require("../utils/rolesEnum")
const checkAuth = require("../utils/checkAuth")
const { uploadImage } = require("../utils/multerConf")

const router = express.Router();




router.post("/", uploadImage, validateInput(validate.imageUpload), imageUpload);
router.get("/:id", getImage);





module.exports = router;