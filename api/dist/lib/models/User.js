"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
;
// Define the User Schema
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    phone: { type: Number, },
    photo: { type: String },
    gender: { type: String, enum: ["Male", "Female"], default: "Male" },
    dateOfBirth: {
        type: String,
        validate: {
            validator: function (value) {
                // Regex to match the format DD-MM-YYYY
                return /^\d{2}-\d{2}-\d{4}$/.test(value);
            },
            message: (props) => `${props.value} is not a valid date! Use DD-MM-YYYY format.`,
        },
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Doctor", "Nurse", "Patient"],
        default: "Patient"
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Create and export the User model
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
