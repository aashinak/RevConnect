import IUser from "../../entities/IUser";

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;

  findUserById(userId: string): Promise<Partial<IUser> | IUser | null>;

  findUserByEmail(email: string): Promise<Partial<IUser> | IUser | null>;

  updateUserById(
    userId: string,
    userUpdate: Partial<IUser>
  ): Promise<Partial<IUser> | IUser | null>;

  updateUserByEmail(
    email: string,
    userUpdate: Partial<IUser>
  ): Promise<Partial<IUser> | IUser | null>;

  deleteUserById(userId: string): Promise<Partial<IUser> | null>;
  
  findOneAndUpdate(
    constraints: Partial<IUser>,
    userUpdate: Partial<IUser>
  ): Promise<Partial<IUser> | IUser | null>;
}
