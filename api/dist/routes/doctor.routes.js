"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_controllers_1 = require("../controllers/doctor.controllers");
const authentication_1 = require("../middlewares/authentication");
const router = express_1.default.Router();
router.get('/', doctor_controllers_1.getAllDoctorInfo);
router.get('/:id', authentication_1.authenticate, doctor_controllers_1.getDoctorInfo);
router.get('/:id/assignedSlots', doctor_controllers_1.getDoctorAssignedSlots);
router.post('/:id/assign/nurse', authentication_1.authenticate, doctor_controllers_1.assignNurseToDoctor);
router.post('/appointment/update/:id', authentication_1.authenticate, doctor_controllers_1.updateAppointment);
exports.default = router;
