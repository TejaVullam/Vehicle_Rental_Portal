import { afterAll } from "vitest";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { PrismaClient } from "@p2p/database";

const prisma = new PrismaClient();

// Delete test users after tests run
afterAll(async () => {
  try {
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "test-auto",
        },
      },
    });
  } catch (error) {
    // Ignore database connection errors during cleanup
    // This allows tests to run even without a database
  } finally {
    await prisma.$disconnect();
  }
});
