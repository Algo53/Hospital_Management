import mongoose, { Document } from "mongoose";

// Defing the Appointment interface
export interface IAppointment extends Document {
    patientId: mongoose.Types.ObjectId,
    doctorId: mongoose.Types.ObjectId,
    scheduledDate: Date,
    status: "Pending" | "Completed",
    progress: number
}

// Defing the Appointment Schema
const AppointmentSchema = new mongoose.Schema<IAppointment>({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
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
        type: Date,
        default: Date.now
    }
})

// Defing the Appointment Model and export it
const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export default Appointment;