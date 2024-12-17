import { Request, Response } from "express";
import User from "../lib/models/User";
import Admin from "../lib/models/Admin";
import Doctor from "../lib/models/Doctor";
import Nurse from "../lib/models/Nurse";
import Patient from "../lib/models/Patient";
import Appointment from "../lib/models/Appointment";

export const getUserInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, role } = (req as any).user;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let data;
        if (role === 'Admin') {
            data = await Admin.findOne({ userId: userId });
        }
        else if (role === 'Doctor') {
            data = await Doctor.findOne({ userId: userId }).populate({ path: 'companyName', select: '-userId' });
        }
        else if (role === 'Nurse') {
            data = await Nurse.findOne({ userId: userId }).populate({ path: 'companyName', select: '-userId' });
        }
        else {
            data = await Patient.findOne({ userId: userId }).populate({ path: 'companyName', select: '-userId' });
        }
        res.status(200).json({ success: true, user, data });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const findUserDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.params.id;
        const userInfo = await User.findById(userId).select("firstName lastName email phone photo gender role");

        const role = userInfo?.role;
        let details;
        if (role === "Admin"){
            details = await Admin.find({userId: userInfo?._id});
        } else if (role === "Doctor"){
            details = await Doctor.find({userId: userInfo?._id});
        } else if (role === "Nurse"){
            details = await Nurse.find({userId: userInfo?._id});
        } else {
            details = await Patient.find({userId: userInfo?._id});
        }

        return res.status(200).json({success: true, data : {userInfo, details}});
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateUserInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, role } = (req as any).user;
        const userid = req.params.id;

        const {firstName, lastName, email, phone, photo, gender, dateOfBirth} = req.body;
        if (userId != userid) {
            return res.status(403).json({ message: 'Unauthorized Access!' });
        }

        const updatedUser = await User.findByIdAndUpdate( 
            userid, 
            {
                firstName,
                lastName,
                email,
                phone,
                photo,
                gender,
                dateOfBirth
            }, 
            {new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userDetails = await User.findById(userid).select("-password");
        return res.status(200).json({ success: true, user: userDetails, message: 'User updated' });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
}

export const getUserAllAppointments = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, role } = (req as any).user;
        const userid = req.params.id;
        if ( userId != userid) {
            return res.status(403).json({ message: 'Unauthorized Access!' });
        };

        let id = null;
        if ( role === 'Doctor') {
            id = await Doctor.findOne({userId: userId}).select('_id');
        }else if ( role === 'Patient') {
            id = await Patient.findOne({userId: userId}).select('_id');
        }

        if ( !id){
            return res.status(404).json({ message: 'User not found' });
        }

        let appointments: any[] = [];
        if ( role === 'Doctor') {
            appointments = await Appointment.find({ doctorId: id }).populate({path: 'patientId', populate: {path:'userId', select:'-password'} });
        }else if ( role === 'Patient') {
            appointments = await Appointment.find({ patientId: id }).populate({path: 'doctorId', populate: {path:'doctorId.userId', select:'-password'} });
        }
        return res.status(200).json({ success: true, data: appointments})
    } catch( error: any ) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};