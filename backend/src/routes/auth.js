const express = require("express");
const { validate, register, activateAccount, login, refresh, forgotPassword, confirmForgotPassword } = require("../controllers/auth")
const validateInput = require("../utils/validateInput")
const rolesEnum = require("../utils/rolesEnum")
const checkAuth = require("../utils/checkAuth")
const { uploadImage } = require("../utils/multerConf")

const router = express.Router();


router.post("/register", checkAuth([rolesEnum.ADMIN]), validateInput(validate.register), register);
router.post("/activate-account", validateInput(validate.activateAccount), activateAccount);


router.post("/login", validateInput(validate.login), login);
router.post("/refresh", validateInput(validate.refresh), refresh);


router.post("/forgot-password", validateInput(validate.forgotPassword), forgotPassword);
router.post("/confirm-forgot-password", validateInput(validate.confirmForgotPassword), confirmForgotPassword);





module.exports = router;