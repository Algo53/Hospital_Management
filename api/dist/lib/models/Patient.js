"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Defining the Patient Schema
const PatientSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    companyName: {
        type: String,
        required: true,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number
    },
    address: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    bloodPressure: {
        type: String
    },
    emergencyContactName: {
        type: String
    },
    emergencyContactPhone: {
        type: String
    },
    emergencyContactRelation: {
        type: String
    },
    appointments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: "Appointment"
        }
    ],
    medicalHistory: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: "MedicalRecord"
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Defining the Patient Model and export it
const Patient = mongoose_1.default.model("Patient", PatientSchema);
exports.default = Patient;
