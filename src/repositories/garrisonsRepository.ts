import { IGarrisonCreateDTO, IGarrisonDTO } from "@/dtos/IGarrisonDTO";
import prisma from "@/lib/prismaDB";
import { connectDB, disconnectDB } from "@/utils/connectionDB";

export const createGarrison = async (
  data: IGarrisonCreateDTO
): Promise<IGarrisonDTO> => {
  await connectDB();
  const garrison = await prisma.garrison.create({
    data: {
      vehicle: {
        connect: {
          id: data.vehicleId,
        },
      },
      militaryInGarrison: {
        create: data.militaryInGarrisonCreate?.map((m) => ({
          militaryId: m.militaryId,
          scaleType: m.scaleType,
        })),
      },
    },
    include: {
      vehicle: true,
      militaryInGarrison: true,
    },
  });

  await disconnectDB();

  return garrison;
};

export const listGarrisonByVehicleAndMilitary = async (
  vehiclesIds: string[],
  militaryInGarrisonIds: string[]
): Promise<IGarrisonDTO | null> => {
  await connectDB();

  const garrison = await prisma.garrison.findFirst({
    where: {
      OR: [
        {
          vehicleId: {
            in: vehiclesIds,
          },
        },
        {
          militaryInGarrison: {
            some: {
              militaryId: {
                in: militaryInGarrisonIds,
              },
            },
          },
        },
      ],
    },
    include: {
      militaryInGarrison: true,
    },
  });

  await disconnectDB();

  return garrison;
};

export const listAllGarrisons = async (): Promise<IGarrisonDTO[]> => {
  await connectDB();

  console.log("dentro repository garrison");

  const garrisons = await prisma.garrison.findMany({
    include: {
      militaryInGarrison: true,
      vehicle: true,
    },
  });
  console.log(garrisons);

  return garrisons;
};

export const deleteAllGarrisons = async (): Promise<void> => {
  await connectDB();

  await prisma.garrison.deleteMany();

  await disconnectDB();
};
