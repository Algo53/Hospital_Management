"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const user_controllers_1 = require("../controllers/user.controllers");
const router = express_1.default.Router();
router.get('/', authentication_1.authenticate, user_controllers_1.getUserInfo);
router.get('/:id', authentication_1.authenticate, user_controllers_1.findUserDetails);
router.get('/:id/appointments', authentication_1.authenticate, user_controllers_1.getUserAllAppointments);
router.post('/:id/update', authentication_1.authenticate, user_controllers_1.updateUserInfo);
exports.default = router;
