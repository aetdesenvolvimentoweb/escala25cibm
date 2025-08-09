export interface IUserCreateDTO {
  userName: string;
  password: string;
}

export interface IUserPublicDTO {
  id: string;
  userName: string;
}

export interface IUserDTO extends IUserCreateDTO {
  id: string;
}
