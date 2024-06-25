import { Router } from "express";
import { addVendor, deleteAllVendors, deleteVendor, getAllVendors, updateVendor, verifyAdmin } from "../controllers/vendor-controller.js";
import { addressParamValidator, validate, vendorDeleteValidator, vendorValidator } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const vendorRoutes = Router();

// TODO: ADD verifytoken BEFORE ALL verifyAdmin FUNCTIONS TO AUTOMATICALLY GET THE USER. CHECK CHAT-CONTROLLERS FOR HOW TO DO THIS LATER WHEN INTEGRATED WITH FRONT END
// TODO: ADD VERIFYADMIN AFTER VERIFYTOKEN AFTER INTEGRATED WITH FRONT END

// get request to get all vendors from user property
vendorRoutes.get("/", getAllVendors);

// post request to add new vendors to user property
vendorRoutes.post("/add", await validate(vendorValidator), verifyToken, verifyAdmin, addVendor);

// delete request to delete a single vendor
vendorRoutes.delete("/delete/:address/:vendorName/:vendorType/", await validate(vendorDeleteValidator), verifyToken, verifyAdmin, deleteVendor);

// delete request for deleting ALL vendors
vendorRoutes.delete("/delete/all/:address/", await validate(addressParamValidator), verifyToken, verifyAdmin, deleteAllVendors);

// post request to update vendor for property
vendorRoutes.post("/update", await validate(vendorValidator), verifyToken, verifyAdmin, updateVendor);

export default vendorRoutes;
