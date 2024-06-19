import mongoose from "mongoose";
import Vendor from "./Vendor.js";
const propertySchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    vendors: [Vendor.schema],
});
export default mongoose.model("Property", propertySchema);
//# sourceMappingURL=Property.js.map