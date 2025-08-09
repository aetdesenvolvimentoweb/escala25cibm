import { IVehicleDTO } from "@/dtos/IVehicleDTO";
import {
  createVehicle,
  listVehicleByName,
} from "@/repositories/vehiclesRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  vehicle?: IVehicleDTO;
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "POST":
      try {
        const { name, status } = JSON.parse(req.body);

        if (!name || !status) {
          throw new Error("Campos obrigatórios não foram preenchidos.");
        }

        const vehicleAlreadyExist = await listVehicleByName(name);

        if (vehicleAlreadyExist) {
          throw new Error("Já existe uma viatura cadastrada com esse nome.");
        }

        const vehicle = await createVehicle({ name, status });

        if (!vehicle) {
          throw new Error("Erro ao cadastrar viatura.");
        }

        res.status(201).json({ success: true, vehicle });
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
