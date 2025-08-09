import { IMilitaryDTO } from "@/dtos/IMilitaryDTO";
import { listGraduationById } from "@/repositories/graduationsRepository";
import {
  createMilitary,
  listMilitaryByRG,
} from "@/repositories/militaryRepository";
import { NextApiRequest, NextApiResponse } from "next";

interface IResponseData {
  success: boolean;
  military?: IMilitaryDTO;
  error?: string;
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>
) => {
  switch (req.method) {
    case "POST":
      try {
        const { graduationId, rg, name } = JSON.parse(req.body);

        if (!graduationId || !rg || !name) {
          throw new Error("Campos obrigatórios não foram preenchidos.");
        }

        const militaryAlreadyExist = await listMilitaryByRG(rg);

        if (militaryAlreadyExist) {
          throw new Error("Já existe militar cadastrado(a) com esse RG.");
        }

        const graduation = await listGraduationById(graduationId);

        const military = await createMilitary({
          graduationId,
          rg,
          name,
        });

        if (!military) {
          throw new Error("Erro ao cadastrar militar.");
        }

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
