import { v2 as cloudinary } from "cloudinary";

const FOLDER = "file uploader";
const isFolderExist = async (folder) => {
  await cloudinary.api
    .resources_by_asset_folder(folder)
    .then(() => true)
    .catch(() => false);
};

export const uploadFile = async (file, foldername) => {
  const { buffer, mimetype } = file;
  const base64 = Buffer.from(buffer).toString("base64");
  const dataURI = `data:${mimetype};base64,${base64}`;

  const folder = `${FOLDER}/${foldername}`;
  const {
    secure_url: url,
    public_id: publicId,
    created_at: uploadedAt,
  } = await cloudinary.uploader.upload(dataURI, { folder });

  return { url, publicId, uploadedAt };
};

export const deleteFile = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export const deleteFolder = async (foldername) => {
  const folder = `${FOLDER}/${foldername}`;

  if (await isFolderExist(folder)) {
    await cloudinary.api.delete_resources_by_prefix(folder);
    await cloudinary.api.delete_folder(folder);
  }
};

export const renameFolder = async (oldname, newname) => {
  const oldFolder = `${FOLDER}/${oldname}`;
  const newFolder = `${FOLDER}/${newname}`;

  if (await isFolderExist(oldFolder))
    await cloudinary.api.rename_folder(oldFolder, newFolder);
};
