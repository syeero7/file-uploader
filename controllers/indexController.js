import { validationResult } from "express-validator";

import {
  createFolder,
  deleteFolder as db_deleteFolder,
  getFolder,
  getFoldersWithFilesByUserId,
  renameFolder as db_renameFolder,
  updateFolderShareUrl,
} from "../prisma/queries.js";
import { validateExpireDate, validateFoldername } from "../utils/validation.js";
import { deleteFolder, renameFolder } from "../utils/cloudinary.js";
import {
  getDateMinmax,
  getShareFolderLink,
  isExpired,
} from "../utils/shareFolder.js";

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

  await deleteFolder(`${userId}/${folderId}`);
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
    const userId = req.user.id;
    const folderId = parseInt(req.params.folderId);

    if (!errors.isEmpty()) {
      const { name } = await getFolder(userId, { id: folderId });
      return res.status(400).render("folder", {
        title: "Rename folder",
        value: name,
        errors: errors.array(),
      });
    }

    const { foldername } = req.body;
    await renameFolder(`${userId}/${folderId}`, `${userId}/${foldername}`);
    await db_renameFolder(folderId, foldername);
    res.redirect("/");
  },
];

export const shareFolderGet = async (req, res) => {
  const userId = parseInt(req.user.id);
  const folderId = parseInt(req.params.folderId);
  const { name } = await getFolder(userId, { id: folderId });

  res.render("share", {
    title: "Share",
    date: getDateMinmax(),
    folder: { name },
  });
};

export const shareFolderPost = [
  validateExpireDate,
  async (req, res) => {
    const errors = validationResult(req);
    const userId = parseInt(req.user.id);
    const folderId = parseInt(req.params.folderId);
    const { name } = await getFolder(userId, { id: folderId });

    if (!errors.isEmpty()) {
      return res.status(400).render("share", {
        errors: errors.array(),
        title: "Share",
        date: getDateMinmax(),
        folder: { name },
      });
    }

    const { expireAt } = req.body;
    const folderLink = getShareFolderLink(req.headers.origin, userId, folderId);

    if (!isExpired(expireAt))
      await updateFolderShareUrl(folderId, folderLink, expireAt);

    res.render("share", {
      title: "Share",
      date: getDateMinmax(),
      folder: { name },
      folderLink,
    });
  },
];

export const getSharedFolder = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { protocol, originalUrl } = req;
  const url = `${protocol}://${req.get("host")}${originalUrl}`;
  const folder = await getFolder(userId, { url }, true);

  if (!folder) return res.status(400).json({ message: "Folder not found" });
  if (isExpired(folder.urlExpireAt))
    return res.status(400).json({ message: "Link is expired" });
  res.render("share", { title: "Shared", folder });
};
