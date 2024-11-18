import { body } from "express-validator";

export const otpEmailPasswordValidationRules = () => {
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

        // Validate and secure the password
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .matches(/[A-Z]/)
            .withMessage("Password must contain at least one uppercase letter")
            .matches(/[a-z]/)
            .withMessage("Password must contain at least one lowercase letter")
            .matches(/[0-9]/)
            .withMessage("Password must contain at least one number")
            .matches(/[@$!%*?&]/)
            .withMessage(
                "Password must contain at least one special character"
            ),
    ];
};
