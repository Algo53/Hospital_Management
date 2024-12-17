import { Request, Response } from "express";
import Doctor from "../lib/models/Doctor";
import Nurse from "../lib/models/Nurse";
import Appointment from "../lib/models/Appointment";

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
        const userId = ( req as any).user.userId;

        if (userId != doctorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized' });
        }

        const doctorInfo = await Doctor.find({userId: doctorId}).populate({ path: "userId", select: "firstName lastName email phone photo"});
        return res.status(200).json({ success: true, data: doctorInfo[0] });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error'})
    }
}

export const assignNurseToDoctor = async (req: Request, res: Response): Promise<any> => {
    try {
        const doctorId = req.params.id;
        const nurseId = req.body.nurseId;
        const userId = ( req as any).user.userId;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor?.userId.equals(userId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized Access!'});
        }

        const nurse = await Nurse.findById(nurseId);
        if (!nurse) {
            return res.status(404).json({ success: false, message: 'Please enter a valid nurse Id'});
        }

        const updateNurseData = await Nurse.findByIdAndUpdate(nurseId, { $set: { assignedDoctor: doctorId }}, { new: true });
        return res.status(200).json({ success: true, data: updateNurseData });
    } catch (error : any) {
        return res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
}

export const getDoctorAssignedSlots = async ( req: Request, res: Response): Promise<any> => {
    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId).select('appointments');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found'});
        }

        const appointments = doctor.appointments;
        // Use aggregation to minimize database queries
        const assignedSlots = await Appointment.find({ _id: { $in: appointments } })
            .select('scheduledDate -_id') // Select only scheduledDate, exclude _id
            .lean(); // Optimize query for better performance

        
        const formattedSlots = assignedSlots.map((appointment) => {
            const [value, data] = appointment.scheduledDate.split(',');
            return { value, data };
        });
        return res.status(200).json({ success: true, data: formattedSlots });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};