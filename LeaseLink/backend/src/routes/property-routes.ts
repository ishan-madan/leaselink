import { Router } from "express";
import { addProperty, deleteProperty, getAllProperties } from "../controllers/property-controllers.js";
import { addressValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
import { verifyAdmin } from "../controllers/vendor-controller.js";

const propertyRoutes = Router();

// get list of all properties in database
propertyRoutes.get("/", getAllProperties);

// send post request to database to add new property to database
propertyRoutes.post("/add", await validate(addressValidator), verifyToken, verifyAdmin, addProperty);

// send delete request to database to delete property
propertyRoutes.delete("/delete/:address", verifyToken, verifyAdmin, deleteProperty);

export default propertyRoutes;