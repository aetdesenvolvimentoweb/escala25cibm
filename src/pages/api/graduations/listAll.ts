import { IGraduationDTO } from "@/dtos/IGraduationDTO";
import { listAllGraduations } from "@/repositories/graduationsRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  graduations?: IGraduationDTO[];
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "GET":
      try {
        const graduations = await listAllGraduations();

        res.status(201).json({ success: true, graduations });
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
