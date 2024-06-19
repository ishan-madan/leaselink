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
        unique: true,
    },
    vendorEmail: {
        type: String,
        required:false,
    },
    vendorPhone: {
        type: String,
        required:false,
    },
    vendorWebsite: {
        type: String,
        required: false,
    },
});

export interface Vendor extends mongoose.Document {
    vendorid: string;
    vendorType: string;
    vendorName: string;
    vendorEmail?: string;
    vendorPhone?: string;
    vendorWebsite?: string;
}

export default mongoose.model("Vendor", vendorSchema);