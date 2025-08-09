import { updateGraduation } from "@/repositories/graduationsRepository";
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
        const { order, name } = JSON.parse(req.body);
        const id = req.query.id as string;

        if (!id) {
          throw new Error("Identificador de posto/graduação não encontrado.");
        }

        if (!order || !name) {
          throw new Error("Campos obrigatórios não foram preenchidos.");
        }

        await updateGraduation(id, {
          order,
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
