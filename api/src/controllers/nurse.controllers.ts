import { Request, Response } from "express";
import Nurse from "../lib/models/Nurse";
import User from "../lib/models/User";
import Patient from "../lib/models/Patient";
import { hashPassword } from "../helper/bcryptHelper";
import Appointment from "../lib/models/Appointment";
import Doctor from "../lib/models/Doctor";

export const getAllNurseInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const nurseInfo = await Nurse.find().populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: nurseInfo});
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
};

export const getNurseInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const nurseId = req.params.id;
        const userId = (req as any).user.userId;
        if (nurseId !== userId) {   
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const nurseInfo = await Nurse.findOne({userId: nurseId}).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: nurseInfo});
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" })
    }
};

export const addNewPatient = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role;

        if (userRole !== 'Nurse' && userId !== id){
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }

        const {firstName, lastName, email, phone, gender, dateOfBirth, photo, height, weight, address, bloodGroup, bloodPressure, emergencyContactName, emergencyContactPhone, emergencyContactRelation} = req.body;
        const password = firstName + '@1234';
        const hashPass = await hashPassword(password);

        const [year, month, day] = dateOfBirth.split("-");
        const formattedDate = `${day}-${month}-${year}`;  

        const userData = {firstName, lastName, email, phone, gender, dateOfBirth: formattedDate, photo, password: hashPass}

        const newUser = await User.create(userData);
        const patient = await newUser.save();

        const nurse = await Nurse.findOne({userId: id});
        if (!nurse){
            return res.status(404).json({ success: false, message: "Nurse not found" });
        }

        const patientData = {
            userId: patient._id,
            companyName: nurse.companyName,
            height, weight, address, bloodGroup, bloodPressure, emergencyContactName, emergencyContactPhone, emergencyContactRelation
        }
        const newPatient = await Patient.create(patientData);

        const data = await newPatient.save();
        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error || "Server Error" })
    }
};

export const bookAppointment = async (req: Request, res: Response): Promise<any> => {
    try {
        const userRole = (req as any).user.role;
        const userId = (req as any).user.userId;
        const id = req.params.id;
        if (userRole !== 'Nurse'){
            return res.status(403).json({ success: false, message: "You are not authorized"});
        }

        if ( userId !== id){
            return res.status(403).json({ success: false, message: "You are not authorized"});
        }
        
        const { patientId, doctorId, reasoneForAppointment, scheduledDate } = req.body;

        const appointment = await Appointment.create({ patientId, doctorId, reasoneForAppointment, scheduledDate });
        const data = await appointment.save();
        
        const updateDoctor = await Doctor.findByIdAndUpdate(doctorId, { $addToSet: { appointments: appointment._id } }, {new: true});
        
        const updatePatient = await Patient.findByIdAndUpdate(patientId, { $addToSet: { appointments: appointment._id } }, {new: true});
        return res.status(200).json({ success: true, data: data });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error || "Server Error" })
    }
};