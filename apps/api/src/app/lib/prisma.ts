import "dotenv/config";

import { PrismaClient } from "../database/client";
import { PrismaPg } from "@prisma/adapter-pg";

const rawDatabaseUrl = process.env.DATABASE_URL;
const databaseUrl = (rawDatabaseUrl ?? "postgres://setlist:lXKcwoxw1eykhDUsgl7ITcamaQszjfQF@172.17.0.1:5432/setlist").trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const prismaClientOptions = { adapter };

export function createPrismaClient() {
  return new PrismaClient(prismaClientOptions);
}
