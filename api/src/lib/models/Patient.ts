import mongoose, { Document } from "mongoose";

// Defining the Patient interface
export interface IPatient extends Document {
    userId: mongoose.Types.ObjectId,
    companyName: string,
    height: number,
    weight: number,
    address: string,
    bloodGroup: string,
    bloodPressure: string,
    emergencyContactName: string,
    emergencyContactPhone: string,
    emergencyContactRelation: string,
    appointments: mongoose.Types.ObjectId[],
    medicalHistory: mongoose.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date
}

// Defining the Patient Schema
const PatientSchema = new mongoose.Schema<IPatient>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Appointment"
        }
    ],
    medicalHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "MedicalRecord"
    },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// Defining the Patient Model and export it
const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
export default Patient;