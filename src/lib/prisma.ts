import { PrismaClient } from '@prisma/client';

// Create Prisma client singleton (not exported directly)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize the client without exporting it directly
const prismaClient = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

// Export an async function to ensure Prisma is connected before use
export async function getPrisma() {
  return prismaClient;
}
