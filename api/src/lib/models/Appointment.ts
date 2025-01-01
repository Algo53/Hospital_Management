import mongoose, { Document } from "mongoose";

// Defing the Appointment interface
export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId,
    doctorId: mongoose.Types.ObjectId,
    reasoneForAppointment: string,
    cureByDoctor: [
        {
            data: string,
            createdAt: Date
        }
    ],
    scheduledDate: string,
    status: "Pending" | "Completed",
    progress: number
}

// Defing the Appointment Schema
const AppointmentSchema = new mongoose.Schema<IAppointment>({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Patient"
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    reasoneForAppointment: {
        type: String,
        default: ""
    },
    cureByDoctor: [
        {
            data: { type: String},
            createdAt: {type: Date, default: Date.now} 
        }
    ],
    status: {
        type: String,
        enum: [ "Pending", "Completed"],
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
})

// Defing the Appointment Model and export it
const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export default Appointment;