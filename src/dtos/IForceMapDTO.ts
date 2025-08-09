import { IGarrisonCreateDTO, IGarrisonDTO } from "./IGarrisonDTO";
import { IMilitaryDTO } from "./IMilitaryDTO";
import {
  IServiceExchangeCreateDTO,
  IServiceExchangeDTO,
} from "./IServiceExchange";

export interface IForceMapCreateDTO {
  initialOfService: Date;
  standbyOfficerId: string;
  adjunctId: string;
  garrisonsIds: string[];
  garrisonsCreate?: IGarrisonCreateDTO[];
  serviceExchangesCreate?: IServiceExchangeCreateDTO[];
  serviceExchangesIds: string[];
}

export interface IForceMapDTO extends IForceMapCreateDTO {
  id: string;
  standbyOfficer?: IMilitaryDTO;
  adjunct?: IMilitaryDTO;
  garrisons?: IGarrisonDTO[];
  serviceExchanges?: IServiceExchangeDTO[];
}
