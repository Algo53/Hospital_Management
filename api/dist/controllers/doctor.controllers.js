"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointment = exports.getDoctorAssignedSlots = exports.assignNurseToDoctor = exports.getDoctorInfo = exports.getAllDoctorInfo = void 0;
const Doctor_1 = __importDefault(require("../lib/models/Doctor"));
const Nurse_1 = __importDefault(require("../lib/models/Nurse"));
const Appointment_1 = __importDefault(require("../lib/models/Appointment"));
const getAllDoctorInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDoctors = yield Doctor_1.default.find().populate({ path: "userId", select: "firstName lastName email phone photo" });
        return res.status(200).json({ success: true, data: allDoctors });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.getAllDoctorInfo = getAllDoctorInfo;
const getDoctorInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.id;
        const userId = req.user.userId;
        if (userId != doctorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized' });
        }
        const doctorInfo = yield Doctor_1.default.find({ userId: doctorId }).populate({ path: "userId", select: "firstName lastName email phone photo" });
        return res.status(200).json({ success: true, data: doctorInfo[0] });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.getDoctorInfo = getDoctorInfo;
const assignNurseToDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.id;
        const nurseId = req.body.nurseId;
        const userId = req.user.userId;
        const doctor = yield Doctor_1.default.findById(doctorId);
        if (!(doctor === null || doctor === void 0 ? void 0 : doctor.userId.equals(userId))) {
            return res.status(403).json({ success: false, message: 'Unauthorized Access!' });
        }
        const nurse = yield Nurse_1.default.findById(nurseId);
        if (!nurse) {
            return res.status(404).json({ success: false, message: 'Please enter a valid nurse Id' });
        }
        const updateNurseData = yield Nurse_1.default.findByIdAndUpdate(nurseId, { $set: { assignedDoctor: doctorId } }, { new: true });
        return res.status(200).json({ success: true, data: updateNurseData });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
});
exports.assignNurseToDoctor = assignNurseToDoctor;
const getDoctorAssignedSlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.id;
        const doctor = yield Doctor_1.default.findById(doctorId).select('appointments');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        const appointments = doctor.appointments;
        // Use aggregation to minimize database queries
        const assignedSlots = yield Appointment_1.default.find({ _id: { $in: appointments } })
            .select('scheduledDate -_id') // Select only scheduledDate, exclude _id
            .lean(); // Optimize query for better performance
        const formattedSlots = assignedSlots.map((appointment) => {
            const [value, data] = appointment.scheduledDate.split(',');
            return { value, data };
        });
        return res.status(200).json({ success: true, data: formattedSlots });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
});
exports.getDoctorAssignedSlots = getDoctorAssignedSlots;
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentId = req.params.id;
        const role = req.user.role;
        if (role !== 'Doctor') {
            return res.status(403).json({ success: false, message: 'Unauthorized Access!' });
        }
        const appointment = yield Appointment_1.default.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found. Please Enter a valid Appointment ID.' });
        }
        if (!appointment.doctorId.equals(req.body.doctorId)) {
            return res.status(403).json({ success: false, message: 'Unauthorized Access!' });
        }
        const { cureByDoctor, progress } = req.body.data;
        // Validate progress
        if (progress !== undefined && (progress < 0 || progress > 100)) {
            return res.status(400).json({
                success: false,
                message: "Progress value must be between 0 and 100.",
            });
        }
        // Update only allowed fields
        if (cureByDoctor) {
            appointment.cureByDoctor.push({ data: cureByDoctor, createdAt: new Date() });
        }
        if (progress !== undefined) {
            appointment.progress = progress;
            if (progress === 100) {
                appointment.status = 'Completed';
            }
        }
        yield appointment.save();
        return res.status(200).json({ success: true, data: appointment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
});
exports.updateAppointment = updateAppointment;
