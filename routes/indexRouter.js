import { Router } from "express";

import {
  createFolderGet,
  createFolderPost,
  deleteFolderPost,
  getFoldersWithFiles,
  renameFolderGet,
  renameFolderPost,
  shareFolderGet,
  shareFolderPost,
  getSharedFolder,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", getFoldersWithFiles);
indexRouter.get("/share/u:userId-:suffix", getSharedFolder);
indexRouter.get("/folder/create", createFolderGet);
indexRouter.get("/folder/:folderId/rename", renameFolderGet);
indexRouter.get("/folder/:folderId/share", shareFolderGet);

indexRouter.post("/folder/create", createFolderPost);
indexRouter.post("/folder/:folderId/delete", deleteFolderPost);
indexRouter.post("/folder/:folderId/rename", renameFolderPost);
indexRouter.post("/folder/:folderId/share", shareFolderPost);

export default indexRouter;
