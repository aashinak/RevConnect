import jwt from "jsonwebtoken";
import logger from "./logger";
import { ApiError } from "./ApiError";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export class TokenService {
    async generateAccessToken(id: string): Promise<string> {
        return await jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });
    }

    async generateRefreshToken(id: string): Promise<string> {
        return await jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });
    }

    async verifyRefreshToken(token: string): Promise<any> {
        try {
            return await jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (error: any) {
            logger.warn(
                `Invalid signature or related error ::: ${error.message}`
            );
            throw new ApiError(400, "Invalid token");
        }
    }
}
