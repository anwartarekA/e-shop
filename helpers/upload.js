const multer = require("multer");
const jwt = require("jsonwebtoken");
const AppError = require("./appError");
const extensions = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = extensions[file.mimetype];
    const id = jwt.decode(req.cookies.cookie_token).id;
    if (!ext) {
      cb(
        new AppError("can't upload that file", 400),
        file.fieldname + "_" + id + "_" + Date.now(),
      );
    }
    cb(null, `${file.fieldname}_${id}_${Date.now()}.${ext}`);
  },
});
module.exports = storage;
