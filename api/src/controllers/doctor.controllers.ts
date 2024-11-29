import { Request, Response } from "express";
import Doctor from "../lib/models/Doctor";

export const getAllDoctorInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const allDoctors = await Doctor.find().populate({ path: "userId", select: "firstName lastName email phone photo"});
        return res.status(200).json({ success: true, data: allDoctors });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getDoctorInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const doctorId = req.params.id;
        const userId = ( req as any).user;
        
        if (userId !== doctorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized' });
        }

        const doctorInfo = await Doctor.findById(doctorId).populate({ path: "userId", select: "firstName lastName email phone photo"});
        return res.status(200).json({ success: true, data: doctorInfo });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error'})
    }
}