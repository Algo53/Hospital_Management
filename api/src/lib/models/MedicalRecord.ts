import mongoose, { Document } from "mongoose";

// Defining the Records interface
export interface IRecord extends Document {
    patientId: mongoose.Types.ObjectId,
    doctorId: mongoose.Types.ObjectId,
    prescription: string,
    createdAt: Date,
    updatedAt: Date
}

// Defining the Records Schema
const RecordSchema = new mongoose.Schema<IRecord>({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Patient"
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor"
    },
    prescription: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

})

// Defining the Records model and export it
const MedicalRecord = mongoose.model<IRecord>("MedicalRecord", RecordSchema);
export default MedicalRecord;