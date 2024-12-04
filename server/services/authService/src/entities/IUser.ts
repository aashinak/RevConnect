export default interface IUser {
    _id?: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    googleId?: string;
    provider: string;
    role: string;
    avatar?: string;
    refreshToken?: string;
    isVerified?: boolean;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
