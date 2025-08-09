import { IMilitaryDTO } from "@/dtos/IMilitaryDTO";
import { listAllMilitary } from "@/repositories/militaryRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  military?: IMilitaryDTO[];
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "GET":
      try {
        const military = await listAllMilitary();

        res.status(201).json({ success: true, military });
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
