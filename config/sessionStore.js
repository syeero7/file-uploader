import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import prisma from "../prisma/prismaClient.js";

const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 1000 * 60 * 2, // 2 min
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

export default sessionStore;
