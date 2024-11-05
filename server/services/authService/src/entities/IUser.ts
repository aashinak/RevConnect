export default interface IUser {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    role: string;
    avatar?: string;
    refreshToken?: string;
    isVerified?: boolean,
    createdAt?: Date;
    updatedAt?: Date;
  }