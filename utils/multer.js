import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const filetype = file.mimetype.split("/")[0];

    if (filetype === "application")
      return cb(new Error("File format not supported"), false);

    cb(null, true);
  },
});
