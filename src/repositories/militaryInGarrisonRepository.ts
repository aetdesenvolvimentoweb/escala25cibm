import {
  IMilitaryInGarrisonCreateDTO,
  IMilitaryInGarrisonDTO,
} from "@/dtos/IGarrisonDTO";
import prisma from "@/lib/prismaDB";
import { connectDB, disconnectDB } from "@/utils/connectionDB";

export const createMilitaryInGarrison = async (
  data: IMilitaryInGarrisonCreateDTO
): Promise<IMilitaryInGarrisonDTO> => {
  await connectDB();

  const militaryInGarrison = await prisma.militaryInGarrison.create({
    data: {
      military: {
        connect: {
          id: data.militaryId,
        },
      },
      scaleType: data.scaleType,
    },
    include: {
      military: true,
    },
  });

  await disconnectDB();

  return militaryInGarrison;
};

export const listMilitaryInGarrisonByMilitaryId = async (
  militaryId: string
): Promise<IMilitaryInGarrisonDTO | null> => {
  await connectDB();

  const militaryInGarrison = await prisma.militaryInGarrison.findFirst({
    where: {
      militaryId: militaryId,
    },
  });

  await disconnectDB();

  return militaryInGarrison;
};

export const listAllGarrisons = async (): Promise<IMilitaryInGarrisonDTO[]> => {
  await connectDB();

  const militaryInGarrison = await prisma.militaryInGarrison.findMany({});

  return militaryInGarrison;
};

export const deleteAllMilitaryInGarrisons = async (): Promise<void> => {
  await connectDB();

  await prisma.militaryInGarrison.deleteMany();

  await disconnectDB();
};

export const updateGarrison = async (
  id: string,
  data: IMilitaryInGarrisonCreateDTO
) => {
  await connectDB();

  await prisma.militaryInGarrison.update({
    where: {
      id,
    },
    data,
  });

  await disconnectDB();
};

export const deleteGarrison = async (id: string): Promise<void> => {
  await connectDB();

  await prisma.militaryInGarrison.delete({
    where: {
      id,
    },
  });

  await disconnectDB();
};
