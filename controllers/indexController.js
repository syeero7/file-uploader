import { validationResult } from "express-validator";

import {
  createFolder,
  deleteFolder as db_deleteFolder,
  getFolder,
  getFoldersWithFilesByUserId,
  renameFolder,
} from "../prisma/queries.js";
import { validateFoldername } from "../utils/validation.js";
import { deleteFolder } from "../utils/cloudinary.js";

export const getFoldersWithFiles = async (req, res) => {
  const userId = req.user?.id;
  const folders = userId ? await getFoldersWithFilesByUserId(userId) : [];

  res.render("index", { folders });
};

export const createFolderGet = async (req, res) => {
  res.render("folder", { title: "Create a folder", value: "" });
};

export const createFolderPost = [
  validateFoldername,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("folder", {
        title: "Create a folder",
        value: "",
        errors: errors.array(),
      });
    }

    const { id } = req.user;
    const { foldername } = req.body;
    await createFolder(id, foldername);
    res.redirect("/");
  },
];

export const deleteFolderPost = async (req, res) => {
  const userId = parseInt(req.user.id);
  const folderId = parseInt(req.params.folderId);
  const { name } = await getFolder(userId, { id: folderId });

  await deleteFolder(name);
  await db_deleteFolder(folderId);
  res.redirect("/");
};

export const renameFolderGet = async (req, res) => {
  const userId = req.user.id;
  const { folderId } = req.params;

  const { name } = await getFolder(userId, { id: parseInt(folderId) });
  res.render("folder", { title: "Rename folder", value: name });
};

export const renameFolderPost = [
  validateFoldername,
  async (req, res) => {
    const errors = validationResult(req);
    const folderId = parseInt(req.params.folderId);

    if (!errors.isEmpty()) {
      const userId = req.user.id;

      const { name } = await getFolder(userId, { id: folderId });
      return res.status(400).render("folder", {
        title: "Rename folder",
        value: name,
        errors: errors.array(),
      });
    }

    const { foldername } = req.body;
    await renameFolder(folderId, foldername);
    res.redirect("/");
  },
];
