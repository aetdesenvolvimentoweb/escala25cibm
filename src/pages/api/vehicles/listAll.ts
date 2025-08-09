import { IVehicleDTO } from "@/dtos/IVehicleDTO";
import { listAllVehicles } from "@/repositories/vehiclesRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  vehicles?: IVehicleDTO[];
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "GET":
      try {
        const vehicles = await listAllVehicles();

        res.status(201).json({ success: true, vehicles });
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
