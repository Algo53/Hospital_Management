import mongoose, { Document } from "mongoose";

// Regular expression to validate time ranges like "08:00-17:30"
const timeRangeRegex = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

// Defining the Nurse interface
export interface INurse extends Document {
    userId: mongoose.Types.ObjectId,
    companyName: string,
    degree: string[],
    specialization: string[],
    shiftTimings: string[]
}

// Defining the Nurse Schema
const NurseSchema = new mongoose.Schema<INurse>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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
                validator: function (value: string) {
                    return timeRangeRegex.test(value); // Validate format
                },
                message: props => `${props.value} is not a valid time range. Use the format like '08:00-17:30'.`
            }
        },
    ],
})

// Defining the Nurse Model and export it
const Nurse = mongoose.model<INurse>("Nurse", NurseSchema);
export default Nurse;