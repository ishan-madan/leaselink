import { Router } from "express";
import { addVendor, deleteAllVendors, deleteVendor, getAllVendors, updateVendor, verifyAdmin } from "../controllers/vendor-controller.js";
import { addressParamValidator, validate, vendorDeleteValidator, vendorValidator } from "../utils/validators.js";
const vendorRoutes = Router();
// ADD verifytoken BEFORE ALL verifyAdmin FUNCTIONS TO AUTOMATICALLY GET THE USER. CHECK CHAT-CONTROLLERS FOR HOW TO DO THIS LATER WHEN INTEGRATED WITH FRONT END
// ADD VERIFYADMIN AFTER VERIFYTOKEN AFTER INTEGRATED WITH FRONT END
// get request to get all vendors from user property
vendorRoutes.get("/", getAllVendors);
// post request to add new vendors to user property
vendorRoutes.post("/add", await validate(vendorValidator), verifyAdmin, addVendor);
// delete request to delete a single vendor
vendorRoutes.delete("/delete/:address/:vendorName/:vendorType/", await validate(vendorDeleteValidator), deleteVendor);
// delete request for deleting ALL vendors
vendorRoutes.delete("/delete/all/:address/", await validate(addressParamValidator), deleteAllVendors);
// post request to update vendor for property
vendorRoutes.post("/update", await validate(vendorValidator), updateVendor);
export default vendorRoutes;
//# sourceMappingURL=vendor-routes.js.map