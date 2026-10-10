// middleware/multer.ts
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import { executionError } from "../services/responseHandling";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return executionError(401, "Only image files are allowed");
    // return cb(new Error("Only image files are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
