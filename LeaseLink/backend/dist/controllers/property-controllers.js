import Property from "../models/Property.js";
export const getAllProperties = async (req, res, next) => {
    try {
        const properties = await Property.find();
        return res.status(200).json({ message: "OK", properties });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const addProperty = async (req, res, next) => {
    try {
        const { address } = req.body;
        // check is property already exists
        const existingProperty = await Property.findOne({ address });
        // if property exists, then return 401 error
        if (existingProperty) {
            return res.status(401).send("Property already exists with this address");
        }
        // create new property and add to database
        const property = new Property({ address });
        await property.save();
        return res.status(201).json({ message: "OK", address: property.address });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteProperty = async (req, res, next) => {
    try {
        const { address } = req.params;
        // check to confirm property exists
        const existingProperty = await Property.findOne({ address });
        // if property does not exist, then return error
        if (!existingProperty) {
            return res.status(404).send("Property not found with this address");
        }
        // delete property from database if it exists
        await Property.deleteOne({ address });
        return res.status(200).json({ message: "Property deleted successfully", address: address });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=property-controllers.js.map