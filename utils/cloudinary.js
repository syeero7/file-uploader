import { v2 as cloudinary } from "cloudinary";

export const uploadFile = async (file, folder) => {
  const { buffer, mimetype } = file;
  const base64 = Buffer.from(buffer).toString("base64");
  const dataURI = `data:${mimetype};base64,${base64}`;

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
  await cloudinary.api.delete_resources_by_prefix(foldername);
  await cloudinary.api.delete_folder(foldername);
};
