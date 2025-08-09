import { IGraduationDTO } from "./IGraduationDTO";

export interface IMilitaryCreateDTO {
  graduationId: string;
  rg: number;
  name: string;
}

export interface IMilitaryDTO extends IMilitaryCreateDTO {
  id: string;
  graduation?: IGraduationDTO;
}
