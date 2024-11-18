import { body } from "express-validator";

export const googleLoginValidationRules = () => {
    return [
        // Validate and sanitize the tokenId for Google login
        body("tokenId")
            .trim()
            .notEmpty()
            .withMessage("Token ID is required")
            .isString()
            .withMessage("Token ID must be a string"),
    ];
};
