import { Router } from "express";
import { addProperty, deleteProperty, getAllProperties } from "../controllers/property-controllers.js";
import { addressValidator, validate } from "../utils/validators.js";
const propertyRoutes = Router();
// get list of all properties in database
propertyRoutes.get("/", getAllProperties);
// send post request to database to add new property to database
propertyRoutes.post("/add", await validate(addressValidator), addProperty);
// send delete request to database to delete property
propertyRoutes.delete("/delete/:address", deleteProperty);
export default propertyRoutes;
//# sourceMappingURL=property-routes.js.map