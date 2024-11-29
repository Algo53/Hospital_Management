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
exports.getNurseInfo = exports.getAllNurseInfo = void 0;
const Nurse_1 = __importDefault(require("../lib/models/Nurse"));
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
        const userId = req.user;
        if (nurseId !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
        const nurseInfo = yield Nurse_1.default.findById(nurseId).populate({ path: "userId", select: "firstName lastName email phone gender photo dateOfBirth" });
        return res.status(200).json({ success: true, data: nurseInfo });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error || "Server Error" });
    }
});
exports.getNurseInfo = getNurseInfo;
