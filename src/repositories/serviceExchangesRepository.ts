import {
  IServiceExchangeCreateDTO,
  IServiceExchangeDTO,
} from "@/dtos/IServiceExchange";
import prisma from "@/lib/prismaDB";
import { connectDB, disconnectDB } from "@/utils/connectionDB";

export const createServiceExchange = async (
  data: IServiceExchangeCreateDTO
): Promise<IServiceExchangeDTO> => {
  await connectDB();

  const serviceExchange = await prisma.serviceExchange.create({
    data: {
      replaced: {
        connect: {
          id: data.replacedId,
        },
      },
      substitute: {
        connect: {
          id: data.substituteId,
        },
      },
      initial: data.initial,
      final: data.final,
    },
  });

  await disconnectDB();

  return serviceExchange;
};

export const deleteAllServiceExchanges = async (): Promise<void> => {
  await connectDB();

  await prisma.serviceExchange.deleteMany();

  await disconnectDB();
};
