import { body, ValidationChain, validationResult } from "express-validator";
import {Request, Response, NextFunction} from "express";

export const validate = async (validations:ValidationChain[]) => {
    return async(req:Request, res:Response, next:NextFunction) => {
        for(let validation of validations){
            const result = await validation.run(req);
            if (!result.isEmpty()){
                break
            }
        }

        const errors = validationResult(req);

        if (errors.isEmpty()){
            return next();
        }
        console.log("validate worked");
        
        return res.status(422).json({errors:errors.array()});
    }
}


export const loginValidator = [
    body("email").trim().isEmail().withMessage("Please enter valid email"),
    body("password").trim().isLength({min: 8}).withMessage("Password must contain at least 8 characters"),
]

export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator,
]

export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Name is required"),
]