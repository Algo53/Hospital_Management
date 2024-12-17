"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controllers_1 = require("../controllers/patient.controllers");
const authentication_1 = require("../middlewares/authentication");
const router = express_1.default.Router();
router.get('/', patient_controllers_1.getAllPatientData);
router.get('/:id', authentication_1.authenticate, patient_controllers_1.getPatientData);
router.post('/find', authentication_1.authenticate, patient_controllers_1.findPatientData);
router.post('/:id/update', authentication_1.authenticate, patient_controllers_1.updatePatientData);
exports.default = router;
