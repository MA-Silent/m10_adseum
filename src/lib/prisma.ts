import { PrismaClient } from "@prisma/client";

declare global {
    var _prisma: PrismaClient;
}

export const prisma = globalThis._prisma ??= new PrismaClient();
