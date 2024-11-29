"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Regular expression to validate time ranges like "08:00-17:30"
const timeRangeRegex = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;
// Defining the Nurse Schema
const NurseSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    companyName: {
        type: String,
        required: true,
    },
    degree: [
        {
            type: String,
            required: true
        }
    ],
    specialization: [
        {
            type: String,
            required: true
        }
    ],
    shiftTimings: [
        {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return timeRangeRegex.test(value); // Validate format
                },
                message: props => `${props.value} is not a valid time range. Use the format like '08:00-17:30'.`
            }
        },
    ],
});
// Defining the Nurse Model and export it
const Nurse = mongoose_1.default.model("Nurse", NurseSchema);
exports.default = Nurse;
