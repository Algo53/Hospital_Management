"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nurse_controllers_1 = require("../controllers/nurse.controllers");
const authentication_1 = require("../middlewares/authentication");
const router = express_1.default.Router();
router.get('/', nurse_controllers_1.getAllNurseInfo);
router.get('/:id', authentication_1.authenticate, nurse_controllers_1.getNurseInfo);
router.post('/:id/patient/add', authentication_1.authenticate, nurse_controllers_1.addNewPatient);
router.post('/:id/appointment/add', authentication_1.authenticate, nurse_controllers_1.bookAppointment);
exports.default = router;
