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
exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const User_1 = __importDefault(require("../lib/models/User"));
const bcryptHelper_1 = require("../helper/bcryptHelper");
const jwtHelper_1 = require("../helper/jwtHelper");
const Admin_1 = __importDefault(require("../lib/models/Admin"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, companyName, phone, gender, dateOfBirth } = req.body;
        // Validate required fields
        if (!firstName || !email || !password || !companyName || !phone || !gender || !dateOfBirth) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        // Hash the password
        const hashedPassword = yield (0, bcryptHelper_1.hashPassword)(password);
        // Create a new user
        const newUser = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            gender,
            dateOfBirth,
            role: "Admin"
        });
        // Save user to database
        const us = yield newUser.save();
        // create and save new admin
        const newAdmin = yield Admin_1.default.create({
            companyName: [companyName],
            userId: us._id
        });
        // Send a success response
        res.status(200).json({
            success: true,
            message: 'User registered successfully'
        });
        return;
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return;
        }
        // Check if the user exists with the provided email or not
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: 'Invalid Credentials!' });
            return;
        }
        // comparing the user enter password with the original
        const hashedPassword = yield (0, bcryptHelper_1.comparePassword)(password, user.password);
        if (!hashedPassword) {
            res.status(400).json({ success: false, message: 'Invalid Credentials!' });
            return;
        }
        // Generate the jwt token and send it to the client
        const token = (0, jwtHelper_1.accessToken)(user._id, user.role);
        // Send a success response
        res.status(200).json({
            success: true,
            accessToken: token,
            role: user.role,
            message: 'User login successfully'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
});
exports.logoutUser = logoutUser;
