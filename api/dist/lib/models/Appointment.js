"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Defing the Appointment Schema
const AppointmentSchema = new mongoose_1.default.Schema({
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    scheduledDate: {
        type: Date,
        default: Date.now
    }
});
// Defing the Appointment Model and export it
const Appointment = mongoose_1.default.model("Appointment", AppointmentSchema);
exports.default = Appointment;
