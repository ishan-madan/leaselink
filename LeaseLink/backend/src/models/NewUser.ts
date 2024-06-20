import mongoose from "mongoose";
import IncidentReport from "./IncidentReport.js";



const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false, 
        required: true, 
    },
    email: {
        type:String,
        required: true,
        unique: true,
    },
    password: {
        type:String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    incidents: [IncidentReport.schema],
});

export default mongoose.model("User", userSchema);