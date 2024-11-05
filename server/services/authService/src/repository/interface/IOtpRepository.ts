import { IOtp } from "../../entities/IOtp";

export interface IOtpRepository {
  /**
   * Save a new OTP or update an existing one.
   * @param email The user's email
   * @param otp The generated OTP (already hashed)
   * @returns The saved OTP document
   */
  saveOtp(email: string, otp: string): Promise<IOtp | null>;

  /**
   * Find an OTP by email.
   * @param email The user's email
   * @returns The OTP document if found, otherwise null
   */
  findOtpByEmail(email: string): Promise<IOtp | null>;

  /**
   * Delete an OTP after verification.
   * @param email The user's email
   * @returns A boolean indicating if deletion was successful
   */
  deleteOtp(email: string): Promise<boolean>;
}
