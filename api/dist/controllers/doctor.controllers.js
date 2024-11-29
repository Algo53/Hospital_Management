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
exports.getDoctorInfo = exports.getAllDoctorInfo = void 0;
const Doctor_1 = __importDefault(require("../lib/models/Doctor"));
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
        const userId = req.user;
        if (userId !== doctorId) {
            return res.status(403).json({ success: false, message: 'You are not authorized' });
        }
        const doctorInfo = yield Doctor_1.default.findById(doctorId).populate({ path: "userId", select: "firstName lastName email phone photo" });
        return res.status(200).json({ success: true, data: doctorInfo });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});
exports.getDoctorInfo = getDoctorInfo;
