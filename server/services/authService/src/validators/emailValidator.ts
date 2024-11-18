import { body } from "express-validator";

export const emailValidationRules = () => {
    return [
        // Validate and sanitize the email
        body("email")
            .trim()
            .isEmail()
            .withMessage("Enter a valid email address")
            .normalizeEmail(),
    ];
};
