const multer = require("multer")
const path = require('node:path')
const { v4 } = require('uuid');
const InformErr = require("./informErr")


const strgPath = "./src/assets/imgs";

const storageConfig = {
  destination: function (req, file, cb) {
    cb(null, strgPath)
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname)
    cb(null, v4() + extName)
  }
}

const storage = multer.diskStorage(storageConfig)



const multerConfig = {
  storage: storage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);

    const allowedExts = ['.png', '.jpg', '.jpeg']

    if (!allowedExts.includes(ext)) {
      return callback('Only .png .jpg .jpeg are allowed', false)
    }

    callback(null, true)
  },
  limits: { fileSize: 2097152 /* 2MB */ }
}


const uploadImage = (req, res, next) => {
  const upload = multer(multerConfig).single('image');

  upload(req, res, (error) => {
    if (error) {
      const err = new InformErr("imgUploadFailed", 400);
      return next(err)

    } else {
      next()
    }
  })
}


module.exports = {
  strgPath,
  uploadImage
}