import mongoose, { Document } from "mongoose";

// Created interface for the Admin
export interface IAdmin extends Document {
    userId: mongoose.Types.ObjectId,
    companyName: string[],
    createdAt: Date,
    updatedAt: Date
}

// Created Schema for the Admin
const AdminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Created Model for the Admin and export it
const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;