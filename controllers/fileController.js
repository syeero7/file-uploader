import https from "https";

import {
  getFoldersByUserId,
  getFolder,
  createFile,
  deleteFile as db_deleteFile,
  getFileById,
} from "../prisma/queries.js";
import { uploadFile, deleteFile } from "../utils/cloudinary.js";

export const uploadFileGet = async (req, res) => {
  const { id } = req.user;
  const folders = await getFoldersByUserId(id);

  res.render("uploadFile", { folders });
};

export const uploadFilePost = async (req, res) => {
  const userId = parseInt(req.user.id);
  const folderId = parseInt(req.body.foldername);
  const { name } = await getFolder(userId, { id: folderId });
  const { url, uploadedAt, publicId } = await uploadFile(req.file, name);
  const { originalname, size } = req.file;

  await createFile(folderId, originalname, size, uploadedAt, url, publicId);
  res.redirect("/");
};

export const viewFileGet = async (req, res) => {
  const { fileId } = req.params;

  const file = await getFileById(parseInt(fileId));
  res.render("file", { file });
};

export const downloadFileGet = async (req, res) => {
  const { fileId } = req.params;
  const { filename, url } = await getFileById(parseInt(fileId));

  res.set("Content-Disposition", `attachment; filename=${filename}`);
  https.get(url, (file) => file.pipe(res));
};

export const deleteFilePost = async (req, res) => {
  const fileId = parseInt(req.params.fileId);
  const { publicId } = await getFileById(fileId);

  await deleteFile(publicId);
  await db_deleteFile(fileId);
  res.redirect("/");
};
