
import IUserActivity from "../../entities/IUserActivity";

export interface IUserActivityRepository {
  createActivity(userId: string, action: string, timestamp: Date): Promise<IUserActivity>;
  getUserActivity(userId: string): Promise<IUserActivity | null>;
  updateUserActivity(userId: string, action: string, timestamp: Date): Promise<IUserActivity | null>;
  deleteUserActivity(userId: string): Promise<IUserActivity | null>;
}
