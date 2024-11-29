"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAdminAuthentication_1 = require("../middlewares/isAdminAuthentication");
const admin_controllers_1 = require("../controllers/admin.controllers");
const router = express_1.default.Router();
router.get('/:id', isAdminAuthentication_1.isAdminCheck, admin_controllers_1.getAdminInfo);
router.post('/addDoctor', isAdminAuthentication_1.isAdminCheck, admin_controllers_1.addDoctor);
router.post('/addNurse', isAdminAuthentication_1.isAdminCheck, admin_controllers_1.addNurse);
router.delete('/delete/:id', isAdminAuthentication_1.isAdminCheck, admin_controllers_1.deleteStaff);
exports.default = router;
