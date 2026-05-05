import { afterAll } from "vitest";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { PrismaClient } from "@p2p/database";

const prisma = new PrismaClient();

// Delete test users after tests run
afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: "test-auto",
      },
    },
  });
  await prisma.$disconnect();
});
