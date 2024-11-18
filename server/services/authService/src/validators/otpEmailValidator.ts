import { body } from "express-validator";

export const otpEmailValidationRules = () => {
    return [
        // Validate and sanitize the email
        body("email")
            .trim()
            .isEmail()
            .withMessage("Enter a valid email address")
            .normalizeEmail(),

        // Validate the OTP
        body("otp")
            .trim()
            .notEmpty()
            .withMessage("OTP is required")
            .isNumeric()
            .withMessage("OTP must be a numeric value")
            .isLength({ min: 6, max: 6 })
            .withMessage("OTP must be 6 digits long"),
    ];
};
