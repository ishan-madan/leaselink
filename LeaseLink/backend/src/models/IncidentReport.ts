import mongoose from "mongoose";
import { randomUUID } from "crypto";
import Chat from "./Chat.js";

// Define the schema
const incidentReportSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => randomUUID(),
    },
    title: {
        type: String,
        required: true,
        unique:false,
    },
    address: {
        type: String,
        required: true,
    },
    openDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    closeDate: {
        type: Date,
        required: false,
    },
    elapsedTime: {
        type: {
            days: Number,
            hours: Number,
            minutes: Number,
            seconds: Number
        },
    },
    chats: [Chat.schema]
});

// Pre-save middleware to calculate and set elapsedTime
incidentReportSchema.pre('save', function (next) {
    if (this.openDate) {
        const openDate = new Date(this.openDate);
        const closeDate = this.closeDate ? new Date(this.closeDate) : new Date(Date.now());
        if (!isNaN(openDate.getTime()) && !isNaN(closeDate.getTime())) {
            const diff = closeDate.getTime() - openDate.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            this.elapsedTime = { days, hours, minutes, seconds };
        }
    }
    next();
});

// Create the model
export default mongoose.model('IncidentReport', incidentReportSchema);
