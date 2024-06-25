import mongoose from "mongoose";
import { randomUUID } from "crypto";
const vendorSchema = new mongoose.Schema({
    vendorid: {
        type: String,
        default: () => randomUUID(),
    },
    vendorName: {
        type: String,
        required: true,
    },
    vendorType: {
        type: String,
        required: true,
    },
    vendorEmail: {
        type: String,
        required: false,
    },
    vendorPhone: {
        type: String,
        required: false,
    },
    vendorWebsite: {
        type: String,
        required: false,
    },
});
export default mongoose.model("Vendor", vendorSchema);
//# sourceMappingURL=Vendor.js.map