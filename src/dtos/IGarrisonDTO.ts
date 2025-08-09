import { IMilitaryDTO } from "./IMilitaryDTO";
import { IVehicleDTO } from "./IVehicleDTO";

export interface IMilitaryInGarrisonCreateDTO {
  militaryId: string;
  scaleType: string;
}

export interface IMilitaryInGarrisonDTO extends IMilitaryInGarrisonCreateDTO {
  id: string;
  military?: IMilitaryDTO;
}

export interface IGarrisonCreateDTO {
  vehicleId: string;
  militaryInGarrisonIds: string[];
  militaryInGarrisonCreate?: IMilitaryInGarrisonCreateDTO[];
}

export interface IGarrisonDTO extends IGarrisonCreateDTO {
  id: string;
  vehicle?: IVehicleDTO;
  militaryInGarrison?: IMilitaryInGarrisonDTO[];
}
