import { body } from "express-validator";

export const userValidationRules = () => {
    return [
        // Validate and sanitize the name
        body("name")
            .trim()
            .isString()
            .withMessage("Name must be a string")
            .isLength({ min: 1, max: 50 })
            .withMessage("Name is required and must not exceed 50 characters")
            .matches(/^[a-zA-Z\s]*$/)
            .withMessage("Name must only contain letters and spaces"),
        body("username")
            .trim()
            .isString()
            .withMessage("Username must be a string")
            .isLength({ min: 1, max: 50 })
            .withMessage(
                "Username is required and must not exceed 50 characters"
            )
            .matches(/^[a-zA-Z]*$/)
            .withMessage("Username must only contain letters and no spaces"),

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
