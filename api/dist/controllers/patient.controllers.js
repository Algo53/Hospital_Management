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
exports.updatePatientData = exports.findPatientData = exports.getPatientData = exports.getAllPatientData = void 0;
const Patient_1 = __importDefault(require("../lib/models/Patient"));
const User_1 = __importDefault(require("../lib/models/User"));
const getAllPatientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield Patient_1.default.find().populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: patients });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
});
exports.getAllPatientData = getAllPatientData;
const getPatientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientId = req.params.id;
        const userId = req.user;
        if (patientId !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const patientInfo = yield Patient_1.default.findById(patientId).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: patientInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.getPatientData = getPatientData;
const findPatientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.body.patientId;
        if (!query) {
            return res.status(400).json({ success: false, message: "Patient ID is required" });
        }
        if (query.includes('@')) {
            const user = yield User_1.default.findOne({ email: query });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            const patientInfo = yield Patient_1.default.findOne({ userId: user._id }).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
            return res.status(200).json({ success: true, data: patientInfo });
        }
        else {
            const patientInfo = yield Patient_1.default.findOne({
                $or: [
                    { _id: query },
                    { userId: query }
                ]
            }).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
            if (!patientInfo) {
                return res.status(404).json({ success: false, message: "Patient not found" });
            }
            return res.status(200).json({ success: true, data: patientInfo });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.findPatientData = findPatientData;
const updatePatientData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        if (userRole !== 'Admin' && userRole !== 'Doctor' && userRole !== 'Nurse') {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const patientId = req.params.id;
        const updatePatient = yield Patient_1.default.findByIdAndUpdate({ _id: patientId }, req.body, { new: true });
        const patientInfo = yield Patient_1.default.findById({ _id: patientId }).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: patientInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
});
exports.updatePatientData = updatePatientData;
