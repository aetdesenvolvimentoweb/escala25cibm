import { updateMilitary } from "@/repositories/militaryRepository";
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
    case "PUT":
      try {
        const { graduationId, rg, name } = JSON.parse(req.body);
        const id = req.query.id as string;

        if (!id) {
          throw new Error("Identificador do(a) militar não encontrado.");
        }

        if (!graduationId || !rg || !name) {
          throw new Error("Campos obrigatórios não foram preenchidos.");
        }

        await updateMilitary(id, {
          graduationId,
          rg: parseInt(rg),
          name,
        });

        res.status(200).json({ success: true });
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
