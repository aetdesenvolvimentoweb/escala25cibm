import prisma from "@/lib/prismaDB";

export const connectDB = async () => {
  return await prisma.$connect();
};

export const disconnectDB = async () => {
  return await prisma.$disconnect();
};
