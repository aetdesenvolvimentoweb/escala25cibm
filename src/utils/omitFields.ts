export function omitFieldsOfUsers<IUserDTO, Key extends keyof IUserDTO>(
  user: IUserDTO,
  keys: Key[]
): Omit<IUserDTO, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
