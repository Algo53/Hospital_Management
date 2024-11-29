import mongoose, { Document } from "mongoose";

// Regular expression to validate time ranges like "08:00-17:30"
const timeRangeRegex = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export interface IDoctor extends Document {
    userId: mongoose.Types.ObjectId,
    companyName: string,
    availableSlots: string[],
    specialization: string[],
    degree: string[],
    department: string,
    assignedPatients: mongoose.Types.ObjectId[],
    appointments: mongoose.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}

const DoctorSchema = new mongoose.Schema<IDoctor>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    companyName: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    degree: [
        {
            type: String,
            required: true,
        }
    ],
    availableSlots: [
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
    specialization: [
        {
            type: String,
            required: true
        }
    ],
    assignedPatients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
        }
    ],
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Doctor = mongoose.model<IDoctor>("Doctors", DoctorSchema);
export default Doctor;