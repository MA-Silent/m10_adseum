import { PrismaClient } from "@/src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
    var _prisma: PrismaClient;
}

const connectionString = `${process.env.DATABASE_URL!}`;

const adapter = new PrismaPg({connectionString})

export const prisma = new PrismaClient({ adapter });
