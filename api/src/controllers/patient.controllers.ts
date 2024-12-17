import { Request, Response } from "express";
import Patient from "../lib/models/Patient";
import User from "../lib/models/User";

export const getAllPatientData = async (req: Request, res: Response): Promise<any> => {
    try {
        const patients = await Patient.find().populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: patients });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
}

export const getPatientData = async (req: Request, res: Response): Promise<any> => {
    try {
        const patientId = req.params.id;
        const userId = (req as any).user;
        if (patientId !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const patientInfo = await Patient.findById(patientId).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: patientInfo });
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
}

export const findPatientData = async (req: Request, res: Response): Promise<any> => {
    try {
        const query = req.body.patientId;
        if (!query){
            return res.status(400).json({ success: false, message: "Patient ID is required"});
        }
        if (query.includes('@')) {
            const user = await User.findOne({ email: query });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            const patientInfo = await Patient.findOne({ userId: user._id }).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
            return res.status(200).json({ success: true, data: patientInfo });
        }
        else {
            const patientInfo = await Patient.findOne({
                $or: [
                    { _id: query },
                    { userId: query }
                ]
            }).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
            if (!patientInfo) {
                return res.status(404).json({ success: false, message: "Patient not found" });
            }
            return res.status(200).json({ success: true, data: patientInfo });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error" })
    }
}

export const updatePatientData = async (req: Request, res: Response): Promise<any> => {
    try {
        const userRole = (req as any).user.role;
        if (userRole !== 'Admin' && userRole !== 'Doctor' && userRole !== 'Nurse') {
            return res.status(403).json({ success: false, message: "You are not authorized"});
        }

        const patientId = req.params.id;

        const updatePatient = await Patient.findByIdAndUpdate({_id: patientId}, req.body, {new: true});

        const patientInfo = await Patient.findById({ _id: patientId }).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth"});
        return res.status(200).json({ success: true, data: patientInfo });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || "Server Error"});
    }
}