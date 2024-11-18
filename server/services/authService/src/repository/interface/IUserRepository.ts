import IUser from "../../entities/IUser";

export interface IUserRepository {
    saveUser(user: IUser): Promise<IUser | null>;
    findUserById(userId: string): Promise<IUser | null>;
    findUserByEmail(email: string): Promise<IUser | null>;
    findUserByGoogleId(googleId: string): Promise<IUser | null>;
    updateUser(
        userId: string,
        userUpdate: Partial<IUser>
    ): Promise<IUser | null>;
    findOneandUpdate(
        constraints: Partial<IUser>,
        userUpdate: Partial<IUser>
    ): Promise<IUser | null>;
}
