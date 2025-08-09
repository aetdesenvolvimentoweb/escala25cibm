import { IForceMapDTO } from "@/dtos/IForceMapDTO";
import { listAllForceMaps } from "@/repositories/forceMapRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  forceMap?: IForceMapDTO[];
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "GET":
      try {
        const forceMap = await listAllForceMaps();

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
