import mongoose, { Document } from "mongoose";

// Define an interface for User
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: number,
    photo: string,
    gender: "Male" | "Female",
    dateOfBirth: string,
    role: "Admin" | "Doctor" | "Nurse" | "Patient",
    createdAt: Date,
    updatedAt: Date
};

// Define the User Schema
const UserSchema = new mongoose.Schema<IUser>({
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
            validator: function (value: string) {
                // Regex to match the format DD-MM-YYYY
                return /^\d{2}-\d{2}-\d{4}$/.test(value);
            },
            message: (props: { value: string }) => `${props.value} is not a valid date! Use DD-MM-YYYY format.`,
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
})

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;