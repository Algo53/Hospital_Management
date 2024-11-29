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
exports.deleteStaff = exports.addNurse = exports.addDoctor = exports.getAdminInfo = void 0;
const User_1 = __importDefault(require("../lib/models/User"));
const bcryptHelper_1 = require("../helper/bcryptHelper");
const Doctor_1 = __importDefault(require("../lib/models/Doctor"));
const Nurse_1 = __importDefault(require("../lib/models/Nurse"));
const Admin_1 = __importDefault(require("../lib/models/Admin"));
const Patient_1 = __importDefault(require("../lib/models/Patient"));
const getAdminInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.id;
        const userId = req.user;
        if (adminId !== userId) {
            return res.status(403).json({ message: "You are not authorized to access this information" });
        }
        const adminInfo = yield Admin_1.default.findOne({ userId: userId }).populate({ path: "userId", select: "firstName lastName email phone photo gender dateOfBirth" });
        return res.status(200).json({ success: true, data: adminInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.getAdminInfo = getAdminInfo;
const addDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let doctorPass = null;
        const { firstName, lastName, email, phone, photo, gender, dateOfBirth, specialization, availableSlots, companyName, department, degree } = req.body;
        // Validate required fields
        if (!firstName || !email || !phone || !companyName || !department || !degree || !gender || !dateOfBirth) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }
        // Check if the user already exists
        let existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Try with unique email address" });
        }
        const password = `${firstName}@1234`;
        doctorPass = password;
        // Hash the password
        const hashedPassword = yield (0, bcryptHelper_1.hashPassword)(password);
        const newUser = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            gender,
            dateOfBirth,
            photo,
            role: "Doctor",
        });
        existingUser = yield newUser.save();
        // Check if the Doctor already exists
        let newDoctor = yield Doctor_1.default.findOne({ userId: existingUser._id });
        if (newDoctor) {
            return res.status(400).json({ success: false, message: "Doctor Already Exist with this data in the DataBase" });
        }
        newDoctor = yield Doctor_1.default.create({
            userId: existingUser._id,
            companyName,
            department,
            degree,
            specialization,
            availableSlots
        });
        const doctorInfo = yield Doctor_1.default.findById(newDoctor._id).populate({ path: 'userId', select: '-password' });
        return res.status(200).json({ success: true, doctorInfo, doctorPass });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.addDoctor = addDoctor;
const addNurse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, phone, photo, gender, dateOfBirth, shiftTimings, companyName, specialization, degree } = req.body;
        // Validate required fields
        if (!firstName || !email || !phone || !companyName || !gender || !dateOfBirth) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }
        // Check if the user already exists
        let existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Try with unique email address" });
        }
        const password = `${firstName}@1234`;
        // Hash the password
        const hashedPassword = yield (0, bcryptHelper_1.hashPassword)(password);
        const newUser = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            photo,
            gender,
            dateOfBirth,
            role: 'Nurse'
        });
        existingUser = yield newUser.save();
        // Check if the Nurse already exists
        let newNurse = yield Nurse_1.default.findOne({ userId: existingUser._id });
        if (newNurse) {
            return res.status(400).json({ success: false, message: "Nurse Already Exist with this data in the DataBase" });
        }
        newNurse = yield Nurse_1.default.create({
            userId: existingUser._id,
            companyName,
            shiftTimings,
            specialization,
            degree
        });
        const nurseInfo = yield Nurse_1.default.findById(newNurse._id).populate({ path: 'userId', select: '-password' });
        return res.status(200).json({ success: true, nurseInfo, password });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.addNurse = addNurse;
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const staff = yield User_1.default.findById(id);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff not found" });
        }
        const userRole = staff.role;
        if (userRole === 'Nurse')
            yield Nurse_1.default.deleteOne({ userId: id });
        else if (userRole === 'Doctor')
            yield Doctor_1.default.deleteOne({ userId: id });
        else
            yield Patient_1.default.deleteOne({ userId: id });
        yield User_1.default.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Staff deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.deleteStaff = deleteStaff;
