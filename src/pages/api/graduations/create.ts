import { IGraduationDTO } from "@/dtos/IGraduationDTO";
import {
  createGraduation,
  listAllGraduations,
  listGraduationByName,
} from "@/repositories/graduationsRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  graduation?: IGraduationDTO;
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "POST":
      try {
        const { name } = JSON.parse(req.body);

        if (!name) {
          throw new Error("Campos obrigatórios não foram preenchidos.");
        }

        const graduationAlreadyExist = await listGraduationByName(name);

        if (graduationAlreadyExist) {
          throw new Error(
            "Já existe posto/graduação cadastrado com esse nome."
          );
        }

        const graduations = await listAllGraduations();

        const graduation = await createGraduation({
          order: graduations.length + 1,
          name,
        });

        if (!graduation) {
          throw new Error("Erro ao cadastrar graduação.");
        }

        res.status(201).json({ success: true, graduation });
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
