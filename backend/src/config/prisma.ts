import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DB URL at prisma init:", process.env.DATABASE_URL);

declare global {
  var __prisma: PrismaClient | undefined;
} 
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = globalThis.__prisma ?? new PrismaClient({adapter})
if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;