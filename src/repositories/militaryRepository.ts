import { IMilitaryCreateDTO, IMilitaryDTO } from "@/dtos/IMilitaryDTO";
import prisma from "@/lib/prismaDB";
import { connectDB, disconnectDB } from "@/utils/connectionDB";

export const createMilitary = async (
  data: IMilitaryCreateDTO
): Promise<IMilitaryDTO> => {
  await connectDB();

  const military = await prisma.military.create({
    data: {
      name: data.name,
      rg: data.rg,
      graduation: {
        connect: {
          id: data.graduationId,
        },
      },
    },
    include: {
      graduation: true,
    },
  });

  await disconnectDB();

  return military;
};

export const listMilitaryById = async (
  id: string
): Promise<IMilitaryDTO | null> => {
  await connectDB();

  const military = await prisma.military.findFirst({
    where: {
      id,
    },
  });

  await disconnectDB();

  return military;
};

export const listMilitaryByRG = async (
  rg: number
): Promise<IMilitaryDTO | null> => {
  await connectDB();

  const military = await prisma.military.findUnique({
    where: {
      rg,
    },
  });

  await disconnectDB();

  return military;
};

export const listAllMilitary = async (): Promise<IMilitaryDTO[]> => {
  await connectDB();

  const military = await prisma.military.findMany({
    select: {
      id: true,
      graduation: true,
      graduationId: true,
      rg: true,
      name: true,
    },
    orderBy: [
      {
        graduation: {
          order: "asc",
        },
      },
      {
        name: "asc",
      },
    ],
  });

  return military;
};

export const updateMilitary = async (id: string, data: IMilitaryCreateDTO) => {
  await connectDB();

  await prisma.military.update({
    where: {
      id,
    },
    data,
  });

  await disconnectDB();
};

export const deleteMilitary = async (id: string): Promise<void> => {
  await connectDB();

  await prisma.military.delete({
    where: {
      id,
    },
  });

  await disconnectDB();
};
