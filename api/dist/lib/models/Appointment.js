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
        ref: "Patient"
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    reasoneForAppointment: {
        type: String,
        default: ""
    },
    cureByDoctor: [
        {
            data: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],
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
        type: String,
        required: true
    }
});
// Defing the Appointment Model and export it
const Appointment = mongoose_1.default.model("Appointment", AppointmentSchema);
exports.default = Appointment;
