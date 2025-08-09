import { IForceMapCreateDTO, IForceMapDTO } from "@/dtos/IForceMapDTO";
import {
  IGarrisonCreateDTO,
  IMilitaryInGarrisonCreateDTO,
} from "@/dtos/IGarrisonDTO";
import { createForceMap } from "@/repositories/forceMapRepository";
import { listGarrisonByVehicleAndMilitary } from "@/repositories/garrisonsRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  forceMap?: IForceMapDTO;
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "POST":
      try {
        const {
          initialOfService,
          standbyOfficerId,
          adjunctId,
          garrisonsCreate,
          garrisonsIds,
          serviceExchangesCreate,
          serviceExchangesIds,
        } = JSON.parse(req.body);

        if (
          !initialOfService ||
          !standbyOfficerId ||
          !adjunctId ||
          !garrisonsCreate ||
          garrisonsCreate.length <= 0
        ) {
          throw new Error("Campos obrigatórios não foram preenchidos.");
        }

        let militaryIds: string[] = [];
        let vehiclesIds: string[] = [];

        await Promise.all(
          garrisonsCreate.map((g: IGarrisonCreateDTO) => {
            g.militaryInGarrisonCreate?.map(
              (m: IMilitaryInGarrisonCreateDTO) => {
                militaryIds = [...militaryIds, m.militaryId];
              }
            );
            vehiclesIds = [...vehiclesIds, g.vehicleId];
          })
        );

        const garrisonAlreadyExist = await listGarrisonByVehicleAndMilitary(
          vehiclesIds,
          militaryIds
        );

        if (garrisonAlreadyExist) {
          throw new Error(
            "Já existe uma guarnição cadastrada com essa viatura ou algum desses militares."
          );
        }

        const data: IForceMapCreateDTO = {
          initialOfService,
          standbyOfficerId,
          adjunctId,
          garrisonsCreate,
          garrisonsIds,
          serviceExchangesCreate,
          serviceExchangesIds,
        };

        const forceMap = await createForceMap(data);

        res.status(201).json({ success: true, forceMap });
      } catch (err: any) {
        res
          .status(400)
          .json({ success: false, error: "Erro interno no servidor." });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Método não suportado." });
      break;
  }
};

export default handler;
