const express = require("express");
const { validate, getUsers, updateUser, deleteUser } = require("../controllers/user")
const validateInput = require("../utils/validateInput")
const rolesEnum = require("../utils/rolesEnum")
const checkAuth = require("../utils/checkAuth")
const { uploadImage } = require("../utils/multerConf")

const router = express.Router();




router.get("/", checkAuth([rolesEnum.REGULARUSER, rolesEnum.ADMIN]), getUsers);

router.patch("/:id", checkAuth([rolesEnum.ADMIN]), validateInput(validate.updateUser), updateUser);

router.delete("/:id", checkAuth([rolesEnum.ADMIN]), deleteUser);





module.exports = router;