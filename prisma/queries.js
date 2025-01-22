import prisma from "./prismaClient.js";

export const getUser = async (uniqueIdentifier) => {
  const user = await prisma.user.findUnique({ where: uniqueIdentifier });
  return user;
};

export const createUser = async (email, password) => {
  await prisma.user.create({
    data: { email, password, folders: { create: { name: "/" } } },
  });
};
