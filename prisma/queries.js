import prisma from "./prismaClient.js";

export const getUser = async (uniqueIdentifier) => {
  const user = await prisma.user.findUnique({ where: uniqueIdentifier });
  return user;
};

export const createUser = async (email, password) => {
  await prisma.user.create({
    data: { email, password, folders: { create: { name: "main" } } },
  });
};

export const getFoldersByUserId = async (ownerId) => {
  const folders = await prisma.folder.findMany({ where: { ownerId } });
  return folders;
};

export const createFolder = async (ownerId, foldername) => {
  await prisma.folder.create({
    data: { name: foldername, owner: { connect: { id: ownerId } } },
  });
};

export const getFolder = async (ownerId, folderUniqueIdentifier) => {
  const folder = await prisma.folder.findFirst({
    where: { ...folderUniqueIdentifier, ownerId },
  });
  return folder;
};

export const getFoldersWithFilesByUserId = async (ownerId) => {
  const folders = await prisma.folder.findMany({
    where: { ownerId },
    include: { files: true },
  });
  return folders;
};

export const deleteFolder = async (folderId) => {
  await prisma.folder.delete({ where: { id: folderId } });
};

export const renameFolder = async (folderId, name) => {
  await prisma.folder.update({ where: { id: folderId }, data: { name } });
};
