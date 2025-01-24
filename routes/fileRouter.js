import { Router } from "express";

import {
  deleteFilePost,
  downloadFileGet,
  uploadFileGet,
  uploadFilePost,
  viewFileGet,
} from "../controllers/fileController.js";
import { upload } from "../utils/multer.js";

const fileRouter = Router();

fileRouter.get("/upload", uploadFileGet);
fileRouter.get("/:fileId", viewFileGet);
fileRouter.get("/:fileId/download", downloadFileGet);

fileRouter.post("/upload", upload.single("file"), uploadFilePost);
fileRouter.post("/:fileId/delete", deleteFilePost);

export default fileRouter;
