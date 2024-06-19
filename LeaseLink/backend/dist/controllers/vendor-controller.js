import Property from "../models/Property.js";
import User from "../models/UserOUTDATED.js";
// when the time comes, change this to await User.findById(res.locals.jwtData.id); and pass in res.locals.jwtData.id as the data instead of email
export const getUserProperty = async (req, res, next) => {
    try {
        // Find user by email
        const email = req.body.email;
        const user = await User.findOne({ email });
        // Handle case where user is not found
        if (!user) {
            return { error: "User not registered or token malfunctioned" };
        }
        // Find property associated with user's address
        const userProperty = await Property.findOne({ address: user.address });
        // Handle case where property is not found
        if (!userProperty) {
            return { error: "Property not found for this user" };
        }
        // Return user and userProperty if found
        return { user, userProperty };
    }
    catch (error) {
        // Handle and log any errors that occur during the process
        console.error('Error in getUserProperty:', error);
        return { error: error.message };
    }
};
// currently needs: email
export const getAllVendors = async (req, res, next) => {
    try {
        // get email from request
        const email = req.body.email;
        // get property
        // MUST CHANGE TO BE "res.locals.jwtData.id" and pass into function to get user
        const userPropertyData = await getUserProperty(req, res, next);
        if (userPropertyData.error) {
            return res.status(401).json({ message: await getUserProperty(req, res, next) });
        }
        const property = userPropertyData.userProperty;
        // get vendors from property 
        const vendors = property.vendors;
        return res.status(200).json({ message: "OK", address: property.address, vendors });
    }
    catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
// middleware to verify admin status
// currently needs: email
export const verifyAdmin = async (req, res, next) => {
    try {
        // get user
        // MUST CHANGE TO BE "res.locals.jwtData.id" and pass into function to get user
        const userPropertyData = await getUserProperty(req, res, next);
        if (userPropertyData.error) {
            return { error: userPropertyData.error };
        }
        // user is being used to verify that this is an admin user. only admin users should be allowed to add vendors, normal people should not
        const adminStatus = userPropertyData.user.admin;
        if (adminStatus) {
            return next();
        }
        else {
            return res.status(403).json({ message: `Admin status required. ${userPropertyData.user.email} is not an admin account` });
        }
    }
    catch (error) {
        console.error('Error in getUserProperty:', error);
        return { error: error.message };
    }
};
// currently needs: email, address, vendor info
export const addVendor = async (req, res, next) => {
    try {
        // get all req data
        const { email, address, vendorType, vendorName, vendorEmail, vendorPhone, vendorWebsite } = req.body;
        // get property from address
        const property = await Property.findOne({ address });
        // if you dont get either the phone or the email, then throw 400 error
        if (!vendorEmail && !vendorPhone) {
            return res.status(400).json({ message: "An email or phone number is required" });
        }
        // if the vendor already exists for this property, throw a 401 error
        const existingVendor = property.vendors.find(vendor => vendor.vendorName === vendorName &&
            vendor.vendorType === vendorType);
        if (existingVendor) {
            return res.status(401).send(`Vendor with name: "${vendorName}" and type: "${vendorType}" already exists for this property`);
        }
        // create vendor object with available optional info from request data
        const newVendor = {
            vendorType,
            vendorName,
            vendorEmail: vendorEmail || undefined,
            vendorPhone: vendorPhone || undefined,
            vendorWebsite: vendorWebsite || undefined,
        };
        // add new vendor to property
        property.vendors.push(newVendor);
        // save to database
        property.markModified('vendors');
        await property.save();
        return res.status(200).json({ message: "OK", property });
    }
    catch (error) {
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
// currently needs: address, vendor name, vendor type
export const deleteVendor = async (req, res, next) => {
    try {
        // get req body values
        const { address, vendorName, vendorType } = req.params;
        // find property
        const property = await Property.findOne({ address });
        // 404 error if property does not exist
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        // find the index of the vendor in the vendors array based on vendorName and vendorType
        const index = property.vendors.findIndex(vendor => vendor.vendorName === vendorName && vendor.vendorType === vendorType);
        // 404 error is vendor does not exist
        if (index === -1) {
            return res.status(404).json({ message: "Vendor not found for this property" });
        }
        // remove the vendor from the vendors array
        property.vendors.splice(index, 1);
        // update property in database
        property.markModified("vendors");
        await property.save();
        return res.status(200).json({ message: "Vendor deleted successfully", property });
    }
    catch (error) {
        console.error("Error deleting vendor:", error);
        return res.status(500).json({ message: "Failed to delete vendor", error: error.message });
    }
};
// currently needs: address
export const deleteAllVendors = async (req, res, next) => {
    try {
        // get req body values
        const { address } = req.params;
        // find property
        const property = await Property.findOne({ address });
        // 404 error if property does not exist
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        // splice out the entire vendors array
        // TRY TO FIND A MORE EFFICIENT WAY TO DO THIS
        property.vendors.splice(0, property.vendors.length);
        // update property in database
        property.markModified("vendors");
        await property.save();
        return res.status(200).json({ message: "All vendors deleted successfully", property });
    }
    catch (error) {
        console.error("Error deleting all vendors:", error);
        return res.status(500).json({ message: "Failed to delete vendors", error: error.message });
    }
};
// currently needs: 
export const updateVendor = async (req, res, next) => {
    try {
        // get values from the request
        const { address, vendorType, vendorName, vendorEmail, vendorPhone, vendorWebsite } = req.body;
        // find property
        const property = await Property.findOne({ address });
        // 404 error if property does not exist
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        // find the index of the vendor in the vendors array based on vendorName and vendorType
        const index = property.vendors.findIndex(vendor => vendor.vendorName === vendorName && vendor.vendorType === vendorType);
        // 404 error is vendor does not exist
        if (index === -1) {
            return res.status(404).json({ message: "Vendor not found for this property" });
        }
        // if you dont get either the phone or the email, then throw 400 error
        if (!vendorEmail && !vendorPhone) {
            return res.status(400).json({ message: "An email or phone number is required" });
        }
        // remove the vendor from the vendors array and save to a new constant
        const updatedVendor = property.vendors.splice(index, 1)[0];
        // update email, phone, and website as necessary
        updatedVendor.vendorEmail = vendorEmail;
        updatedVendor.vendorPhone = vendorPhone;
        updatedVendor.vendorWebsite = vendorWebsite;
        // push updated Vendor back to vendor array
        property.vendors.push(updatedVendor);
        // save new info to database
        property.markModified("vendors");
        await property.save();
        // return status
        return res.status(200).json({ message: "OK", updatedVendor: updatedVendor });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=vendor-controller.js.map