export interface IGraduationCreateDTO {
  order: number;
  name: string;
}

export interface IGraduationDTO extends IGraduationCreateDTO {
  id: string;
}
