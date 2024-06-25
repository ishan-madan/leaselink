import { body, param, validationResult } from "express-validator";
import validator from "validator";
export const validate = async (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    };
};
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Please enter valid email"),
    body("password").trim().isLength({ min: 8 }).withMessage("Password must contain at least 8 characters"),
];
export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator,
];
export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Name is required"),
];
export const addressValidator = [
    body("address").notEmpty().withMessage("Address is required"),
];
export const vendorValidator = [
    body("vendorType").notEmpty().withMessage("Vendor Type is required").isString().withMessage("Vendor Type must be a string"),
    body("vendorName").notEmpty().withMessage("Vendor Name is required").isString().withMessage("Vendor Name must be a string"),
    body("vendorEmail").optional({ nullable: true, checkFalsy: true }).isEmail().withMessage("Invalid email format"),
    body("vendorPhone").optional({ nullable: true, checkFalsy: true }).custom((value) => {
        // Custom validation to check for valid phone number format
        if (!validator.isMobilePhone(value, "any", { strictMode: false })) {
            throw new Error("Invalid phone number format");
        }
        return true;
    }),
    body("vendorWebsite").optional({ nullable: true, checkFalsy: true }).isURL().withMessage("Invalid URL format"),
    ...addressValidator,
];
export const vendorDeleteValidator = [
    param("address").notEmpty().withMessage("Address is required").isString().withMessage("Address must be a string"),
    param("vendorType").notEmpty().withMessage("Vendor Type is required").isString().withMessage("Vendor Type must be a string"),
    param("vendorName").notEmpty().withMessage("Vendor Name is required").isString().withMessage("Vendor Name must be a string"),
];
export const addressParamValidator = [
    param("address").notEmpty().withMessage("Address is required").isString().withMessage("Address must be a string"),
];
export const idValidator = [
    param("incidentId").isString().withMessage("Please enter a string"),
];
//# sourceMappingURL=validators.js.map