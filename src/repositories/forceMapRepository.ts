import { IForceMapCreateDTO, IForceMapDTO } from "@/dtos/IForceMapDTO";
import prisma from "@/lib/prismaDB";
import { connectDB, disconnectDB } from "@/utils/connectionDB";

export const createForceMap = async (
  data: IForceMapCreateDTO
): Promise<IForceMapDTO> => {
  await connectDB();

  const forceMap = await prisma.forceMap.create({
    data: {
      initialOfService: data.initialOfService,
      standbyOfficer: {
        connect: {
          id: data.standbyOfficerId,
        },
      },
      adjunct: {
        connect: {
          id: data.adjunctId,
        },
      },
      garrisons: {
        create: data.garrisonsCreate?.map((g) => ({
          vehicle: {
            connect: {
              id: g.vehicleId,
            },
          },
          militaryInGarrison: {
            create: g.militaryInGarrisonCreate?.map((m) => ({
              militaryId: m.militaryId,
              scaleType: m.scaleType,
            })),
          },
        })),
      },
      serviceExchanges: {
        create: data.serviceExchangesCreate?.map((se) => ({
          replaced: {
            connect: {
              id: se.replacedId,
            },
          },
          substitute: {
            connect: {
              id: se.substituteId,
            },
          },
          initial: se.initial,
          final: se.final,
        })),
      },
    },
  });

  await disconnectDB();

  return forceMap;
};

export const listAllForceMaps = async (): Promise<IForceMapDTO[]> => {
  await connectDB();

  const forceMaps = await prisma.forceMap.findMany({
    include: {
      standbyOfficer: {
        include: {
          graduation: true,
        },
      },
      adjunct: {
        include: {
          graduation: true,
        },
      },
      garrisons: {
        include: {
          vehicle: true,
          militaryInGarrison: {
            include: {
              military: {
                include: {
                  graduation: true,
                },
              },
            },
          },
        },
      },
      serviceExchanges: {
        include: {
          replaced: {
            include: {
              graduation: true,
            },
          },
          substitute: {
            include: {
              graduation: true,
            },
          },
        },
      },
    },
  });

  return forceMaps;
};

export const deleteAllForceMaps = async (): Promise<void> => {
  await connectDB();

  await prisma.forceMap.deleteMany();

  await disconnectDB();
};
