import mongoose from "mongoose";
import IncidentReport from "./IncidentReport.js";


// maybe alter this to have chats be an array of an array or an array. outermost array holds all incident reports. middle array is each invididual incident report, containing incident report title and an array of chats. inner most array would be that array of chats. 
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