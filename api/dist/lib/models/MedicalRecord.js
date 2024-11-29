"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Defining the Records Schema
const RecordSchema = new mongoose_1.default.Schema({
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Patient"
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor"
    },
    prescription: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Defining the Records model and export it
const MedicalRecord = mongoose_1.default.model("MedicalRecord", RecordSchema);
exports.default = MedicalRecord;
