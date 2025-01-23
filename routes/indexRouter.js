import { Router } from "express";

import {
  createFolderGet,
  createFolderPost,
  deleteFolderPost,
  getFoldersWithFiles,
  renameFolderGet,
  renameFolderPost,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", getFoldersWithFiles);
indexRouter.get("/folder/create", createFolderGet);
indexRouter.get("/folder/:folderId/rename", renameFolderGet);

indexRouter.post("/folder/create", createFolderPost);
indexRouter.post("/folder/:folderId/delete", deleteFolderPost);
indexRouter.post("/folder/:folderId/rename", renameFolderPost);

export default indexRouter;
