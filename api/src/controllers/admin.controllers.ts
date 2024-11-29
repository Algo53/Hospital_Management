import { Request, Response } from "express";
import User from "../lib/models/User";
import { hashPassword } from "../helper/bcryptHelper";
import Doctor from "../lib/models/Doctor";
import Nurse from "../lib/models/Nurse";
import Admin from "../lib/models/Admin";
import Patient from "../lib/models/Patient";

export const getAdminInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const adminId = req.params.id;
        const userId = (req as any).user;

        if (adminId !== userId) {
            return res.status(403).json({ message: "You are not authorized to access this information"})
        }

        const adminInfo = await Admin.findOne({userId : userId}).populate({ path: "userId", select: "firstName lastName email phone photo gender dateOfBirth"});
        return res.status(200).json({ success: true, data: adminInfo});
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
}

export const addDoctor = async (req: Request, res: Response): Promise<any> => {
    try {
        let doctorPass: string | null = null;
        const { firstName, lastName, email, phone, photo, gender, dateOfBirth, specialization, availableSlots, companyName, department, degree } = req.body;

        // Validate required fields
        if (!firstName || !email || !phone || !companyName || !department || !degree || !gender || !dateOfBirth) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success: false, message: "Try with unique email address"})
        }
        
        const password = `${firstName}@1234`;
        doctorPass = password;
        // Hash the password
        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            gender,
            dateOfBirth,
            photo,
            role: "Doctor",
        })
        existingUser = await newUser.save();

        // Check if the Doctor already exists
        let newDoctor = await Doctor.findOne({ userId: existingUser._id });
        if (newDoctor) {
            return res.status(400).json({ success: false, message: "Doctor Already Exist with this data in the DataBase" })
        }

        newDoctor = await Doctor.create({
            userId: existingUser._id,
            companyName,
            department,
            degree,
            specialization,
            availableSlots
        })

        const doctorInfo = await Doctor.findById(newDoctor._id).populate({ path: 'userId', select: '-password' });
        return res.status(200).json({ success: true, doctorInfo, doctorPass })
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
}

export const addNurse = async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstName, lastName, email, phone, photo, gender, dateOfBirth, shiftTimings, companyName, specialization, degree} = req.body;

        // Validate required fields
        if (!firstName || !email || !phone || !companyName || !gender ||  !dateOfBirth ) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success: false, message: "Try with unique email address"})
        }

        const password = `${firstName}@1234`;
        
        // Hash the password
        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            photo,
            gender, 
            dateOfBirth,
            role: 'Nurse'
        })
        existingUser = await newUser.save();

        // Check if the Nurse already exists
        let newNurse = await Nurse.findOne({ userId: existingUser._id });
        if (newNurse) {
            return res.status(400).json({ success: false, message: "Nurse Already Exist with this data in the DataBase" })
        }

        newNurse = await Nurse.create({
            userId: existingUser._id,
            companyName,
            shiftTimings,
            specialization,
            degree
        })

        const nurseInfo = await Nurse.findById(newNurse._id).populate({ path: 'userId', select: '-password' });
        return res.status(200).json({ success: true, nurseInfo, password})
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
}

export const deleteStaff = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const staff = await User.findById(id);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff not found"});
        }
        
        const userRole = staff.role;
        if (userRole === 'Nurse') await Nurse.deleteOne({ userId: id });
        else if (userRole === 'Doctor') await Doctor.deleteOne({ userId: id });
        else await Patient.deleteOne({ userId: id });

        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error"})
    }
}