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
exports.getUserAllAppointments = exports.updateUserInfo = exports.findUserDetails = exports.getUserInfo = void 0;
const User_1 = __importDefault(require("../lib/models/User"));
const Admin_1 = __importDefault(require("../lib/models/Admin"));
const Doctor_1 = __importDefault(require("../lib/models/Doctor"));
const Nurse_1 = __importDefault(require("../lib/models/Nurse"));
const Patient_1 = __importDefault(require("../lib/models/Patient"));
const Appointment_1 = __importDefault(require("../lib/models/Appointment"));
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.user;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let data;
        if (role === 'Admin') {
            data = yield Admin_1.default.findOne({ userId: userId });
        }
        else if (role === 'Doctor') {
            data = yield Doctor_1.default.findOne({ userId: userId }).populate({ path: 'companyName', select: '-userId' });
        }
        else if (role === 'Nurse') {
            data = yield Nurse_1.default.findOne({ userId: userId }).populate({ path: 'companyName', select: '-userId' });
        }
        else {
            data = yield Patient_1.default.findOne({ userId: userId }).populate({ path: 'companyName', select: '-userId' });
        }
        res.status(200).json({ success: true, user, data });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getUserInfo = getUserInfo;
const findUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const userInfo = yield User_1.default.findById(userId).select("firstName lastName email phone photo gender role");
        const role = userInfo === null || userInfo === void 0 ? void 0 : userInfo.role;
        let details;
        if (role === "Admin") {
            details = yield Admin_1.default.find({ userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id });
        }
        else if (role === "Doctor") {
            details = yield Doctor_1.default.find({ userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id });
        }
        else if (role === "Nurse") {
            details = yield Nurse_1.default.find({ userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id });
        }
        else {
            details = yield Patient_1.default.find({ userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id });
        }
        return res.status(200).json({ success: true, data: { userInfo, details } });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.findUserDetails = findUserDetails;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.user;
        const userid = req.params.id;
        const { firstName, lastName, email, phone, photo, gender, dateOfBirth } = req.body;
        if (userId != userid) {
            return res.status(403).json({ message: 'Unauthorized Access!' });
        }
        const updatedUser = yield User_1.default.findByIdAndUpdate(userid, {
            firstName,
            lastName,
            email,
            phone,
            photo,
            gender,
            dateOfBirth
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userDetails = yield User_1.default.findById(userid).select("-password");
        return res.status(200).json({ success: true, user: userDetails, message: 'User updated' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.updateUserInfo = updateUserInfo;
const getUserAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.user;
        const userid = req.params.id;
        if (userId != userid) {
            return res.status(403).json({ message: 'Unauthorized Access!' });
        }
        ;
        let id = null;
        if (role === 'Doctor') {
            id = yield Doctor_1.default.findOne({ userId: userId }).select('_id');
        }
        else if (role === 'Patient') {
            id = yield Patient_1.default.findOne({ userId: userId }).select('_id');
        }
        if (!id) {
            return res.status(404).json({ message: 'User not found' });
        }
        let appointments = [];
        if (role === 'Doctor') {
            appointments = yield Appointment_1.default.find({ doctorId: id }).populate({ path: 'patientId', populate: { path: 'userId', select: '-password' } });
        }
        else if (role === 'Patient') {
            appointments = yield Appointment_1.default.find({ patientId: id }).populate({ path: 'doctorId', populate: { path: 'doctorId.userId', select: '-password' } });
        }
        return res.status(200).json({ success: true, data: appointments });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.getUserAllAppointments = getUserAllAppointments;
