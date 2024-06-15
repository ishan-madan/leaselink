import { Router } from "express";
import { getAllUsers, userLogin, userSignup, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
// get list of all signed up users in database
userRoutes.get("/", getAllUsers);
// sends post request to database to add new user to database
userRoutes.post("/signup", await validate(signupValidator), userSignup);
// sends post request to database to validate user login
userRoutes.post("/login", await validate(loginValidator), userLogin);
// sends get request to the database to get user cookie
userRoutes.get("/auth-status", verifyToken, verifyUser);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map