"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.accessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "nasnnewDFdkKsjnfSDfSDjkfn";
// Generating accessToken for the user
const accessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, secret, { expiresIn: '1h' });
};
exports.accessToken = accessToken;
// Verifying the user accessToken and return the decoded token back
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (err) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
