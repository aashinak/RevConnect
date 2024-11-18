import { body } from "express-validator";

export const userLoginValidationRules = () => {
    return [
        // Validate and sanitize the email
        body("email")
            .trim()
            .isEmail()
            .withMessage("Enter a valid email address")
            .normalizeEmail(),

        // Validate and secure the password
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),
    ];
};
