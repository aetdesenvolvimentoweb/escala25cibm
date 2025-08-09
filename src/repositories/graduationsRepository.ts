import { IGraduationCreateDTO, IGraduationDTO } from "@/dtos/IGraduationDTO";
import prisma from "@/lib/prismaDB";
import { connectDB, disconnectDB } from "@/utils/connectionDB";

export const createGraduation = async (
  data: IGraduationCreateDTO
): Promise<IGraduationDTO> => {
  await connectDB();

  const graduations = await prisma.graduation.create({
    data,
  });

  await disconnectDB();

  return graduations;
};

export const listGraduationById = async (
  id: string
): Promise<IGraduationDTO | null> => {
  await connectDB();

  const graduation = await prisma.graduation.findFirst({
    where: {
      id,
    },
  });

  await disconnectDB();

  return graduation;
};

export const listGraduationByName = async (
  name: string
): Promise<IGraduationDTO | null> => {
  await connectDB();

  const graduation = await prisma.graduation.findUnique({
    where: {
      name,
    },
  });

  await disconnectDB();

  return graduation;
};

export const listAllGraduations = async (): Promise<IGraduationDTO[]> => {
  await connectDB();

  const graduations = await prisma.graduation.findMany({
    orderBy: [
      {
        order: "asc",
      },
    ],
  });

  return graduations;
};

export const updateGraduation = async (
  id: string,
  data: IGraduationCreateDTO
) => {
  await connectDB();

  await prisma.graduation.update({
    where: {
      id,
    },
    data,
  });

  await disconnectDB();
};

export const deleteGraduation = async (id: string): Promise<void> => {
  await connectDB();

  await prisma.graduation.delete({
    where: {
      id,
    },
  });

  await disconnectDB();
};
