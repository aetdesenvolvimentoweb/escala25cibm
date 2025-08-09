import { deleteAllForceMaps } from "@/repositories/forceMapRepository";
import { deleteAllGarrisons } from "@/repositories/garrisonsRepository";
import { deleteAllMilitaryInGarrisons } from "@/repositories/militaryInGarrisonRepository";
import { deleteAllServiceExchanges } from "@/repositories/serviceExchangesRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "GET":
      try {
        await deleteAllForceMaps();
        await deleteAllGarrisons();
        await deleteAllMilitaryInGarrisons();
        await deleteAllServiceExchanges();

        res.status(200).json({ success: true });
      } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Método não suportado." });
      break;
  }
};

export default handler;
