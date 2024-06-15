import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (req, res, next) => {
    // get all users directly from datbase
    try {
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", casue: error.message });
    }
};
export const userSignup = async (req, res, next) => {
    // user signup
    try {
        const { name, email, password } = req.body;
        // check if email alr registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send("User already exists with this email");
        }
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        // clear any previous cookies
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        // generate jwt token and expiration date
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        // send token in the form of cookies, 
        // TODO: WHEN YOU DEPLOY, CHANGE DOMAIN TO ACTUAL DOMAIN OF WEBSITE
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(201).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", casue: error.message });
    }
};
export const userLogin = async (req, res, next) => {
    // user login
    try {
        const { email, password } = req.body;
        // first find user by email
        const user = await User.findOne({ email });
        // if user does not exist, give error message
        if (!user) {
            return res.status(401).send("Account does not exist");
        }
        // verify password if user exists
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Incorrect password");
        }
        // clear any previous cookies
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });
        // generate jwt token and expiration date
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        // send token in the form of cookies, 
        // TODO: WHEN YOU DEPLOY, CHANGE DOMAIN TO ACTUAL DOMAIN OF WEBSITE
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        // if user exists and password is correct, return OK
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", casue: error.message });
    }
};
export const verifyUser = async (req, res, next) => {
    // user verify
    try {
        // find user from date from previous middleware
        const user = await User.findById(res.locals.jwtData.id);
        // if user does not exist, give error message
        if (!user) {
            return res.status(401).send("Account does not exist OR Token malfunctioned");
        }
        // only pass this step of the id of the user matches
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        // if user exists and password is correct, return OK
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", casue: error.message });
    }
};
//# sourceMappingURL=user-controllers.js.map