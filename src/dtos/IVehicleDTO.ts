export interface IVehicleCreateDTO {
  name: string;
  status: string;
}

export interface IVehicleDTO extends IVehicleCreateDTO {
  id: string;
}
