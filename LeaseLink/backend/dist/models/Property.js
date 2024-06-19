import mongoose from "mongoose";
import { randomUUID } from "crypto";
const vendorSchema = new mongoose.Schema({
    vendorid: {
        type: String,
        default: randomUUID(),
    },
    vendorType: {
        type: String,
        required: true,
    },
    vendorName: {
        type: String,
        required: true,
    },
    vendorEmail: {
        type: String,
        validate: {
            validator: function (v) {
                return v || this.vendorPhone;
            },
            message: 'Either email or phone number is required.',
        },
    },
    vendorPhone: {
        type: String,
        validate: {
            validator: function (v) {
                return v || this.vendorEmail;
            },
            message: 'Either phone number or email is required.',
        },
    },
    vendorWebsite: {
        type: String,
        required: false,
    },
});
const propertySchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    vendors: [vendorSchema],
});
export default mongoose.model("Property", propertySchema);
//# sourceMappingURL=Property.js.map