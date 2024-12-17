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
exports.bookAppointment = exports.addNewPatient = exports.getNurseInfo = exports.getAllNurseInfo = void 0;
const Nurse_1 = __importDefault(require("../lib/models/Nurse"));
const User_1 = __importDefault(require("../lib/models/User"));
const Patient_1 = __importDefault(require("../lib/models/Patient"));
const bcryptHelper_1 = require("../helper/bcryptHelper");
const Appointment_1 = __importDefault(require("../lib/models/Appointment"));
const Doctor_1 = __importDefault(require("../lib/models/Doctor"));
const getAllNurseInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurseInfo = yield Nurse_1.default.find().populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: nurseInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.getAllNurseInfo = getAllNurseInfo;
const getNurseInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurseId = req.params.id;
        const userId = req.user.userId;
        if (nurseId !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const nurseInfo = yield Nurse_1.default.findOne({ userId: nurseId }).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: nurseInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.getNurseInfo = getNurseInfo;
const addNewPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const userRole = req.user.role;
        if (userRole !== 'Nurse' && userId !== id) {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const { firstName, lastName, email, phone, gender, dateOfBirth, photo, height, weight, address, bloodGroup, bloodPressure, emergencyContactName, emergencyContactPhone, emergencyContactRelation } = req.body;
        const password = firstName + '@1234';
        const hashPass = yield (0, bcryptHelper_1.hashPassword)(password);
        const [year, month, day] = dateOfBirth.split("-");
        const formattedDate = `${day}-${month}-${year}`;
        const userData = { firstName, lastName, email, phone, gender, dateOfBirth: formattedDate, photo, password: hashPass };
        const newUser = yield User_1.default.create(userData);
        const patient = yield newUser.save();
        const nurse = yield Nurse_1.default.findOne({ userId: id });
        if (!nurse) {
            return res.status(404).json({ success: false, message: "Nurse not found" });
        }
        const patientData = {
            userId: patient._id,
            companyName: nurse.companyName,
            height, weight, address, bloodGroup, bloodPressure, emergencyContactName, emergencyContactPhone, emergencyContactRelation
        };
        const newPatient = yield Patient_1.default.create(patientData);
        const data = yield newPatient.save();
        return res.status(200).json({ success: true, data: data });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.addNewPatient = addNewPatient;
const bookAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        const userId = req.user.userId;
        const id = req.params.id;
        if (userRole !== 'Nurse') {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        if (userId !== id) {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const { patientId, doctorId, reasoneForAppointment, scheduledDate } = req.body;
        const appointment = yield Appointment_1.default.create({ patientId, doctorId, reasoneForAppointment, scheduledDate });
        const data = yield appointment.save();
        const updateDoctor = yield Doctor_1.default.findByIdAndUpdate(doctorId, { $addToSet: { appointments: appointment._id } }, { new: true });
        const updatePatient = yield Patient_1.default.findByIdAndUpdate(patientId, { $addToSet: { appointments: appointment._id } }, { new: true });
        return res.status(200).json({ success: true, data: data });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.bookAppointment = bookAppointment;
