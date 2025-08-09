import { IMilitaryDTO } from "./IMilitaryDTO";

export interface IServiceExchangeCreateDTO {
  replacedId: string;
  substituteId: string;
  initial: Date;
  final: Date;
}

export interface IServiceExchangeDTO extends IServiceExchangeCreateDTO {
  id: string;
  replaced?: IMilitaryDTO;
  substitute?: IMilitaryDTO;
}
