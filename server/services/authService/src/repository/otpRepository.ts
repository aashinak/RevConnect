import { IOtp } from "../entities/IOtp"; // Import the OTP entity interface
import { Otp } from "../models/OtpModel";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger"; // Logger for logging info or errors
import { IOtpRepository } from "./interface/IOtpRepository";

export class OtpRepository implements IOtpRepository {
  /**
   * Save a new OTP record for a user.
   * If an OTP already exists for the email, update it with a new one.
   * @param email The user's email
   * @param otp The generated OTP (already hashed)
   * @returns The saved OTP document
   */
  async saveOtp(email: string, otp: string): Promise<IOtp | null> {
    try {
      const otpDoc = await Otp.findOneAndUpdate(
        { email },
        { otp, otpCreatedAt: new Date() },
        { upsert: true, new: true }
      );
      return otpDoc;
    } catch (error: any) {
      logger.error(`Failed to save OTP for email ${email}: ${error.message}`);
      throw new ApiError(500, `Failed to save OTP for email ${email}`)
    }
  }

  /**
   * Find an OTP record by email.
   * @param email The user's email
   * @returns The OTP document if found, otherwise null
   */
  async findOtpByEmail(email: string): Promise<IOtp | null> {
    try {
      const otpDoc = await Otp.findOne({ email });
      return otpDoc;
    } catch (error: any) {
      logger.error(`Failed to find OTP for email ${email}: ${error.message}`);
      throw new ApiError(500, `Failed to find OTP for email ${email}`)
    }
  }

  /**
   * Delete the OTP record after successful verification.
   * @param email The user's email
   * @returns A boolean indicating whether the deletion was successful
   */
  async deleteOtp(email: string): Promise<boolean> {
    try {
      const result = await Otp.deleteOne({ email });
      return result.deletedCount === 1;
    } catch (error: any) {
      logger.error(`Failed to delete OTP for email ${email}: ${error.message}`);
      throw new ApiError(500, `Failed to delete OTP for email ${email}`)
    }
  }
}
