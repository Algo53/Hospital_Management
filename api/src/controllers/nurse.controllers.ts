import { Request, Response } from "express";
import Nurse from "../lib/models/Nurse";

export const getAllNurseInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const nurseInfo = await Nurse.find().populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: nurseInfo});
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
}

export const getNurseInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const nurseId = req.params.id;
        const userId = (req as any).user;
        if (nurseId !== userId) {   
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const nurseInfo = await Nurse.findById(nurseId).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: nurseInfo});
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
}