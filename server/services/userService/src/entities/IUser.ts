export default interface IUser {
  _id?: string;
  name: string;
  bio: string;
  gender: string;
  email: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
