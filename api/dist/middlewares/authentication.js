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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwtHelper_1 = require("../helper/jwtHelper");
// Checking the authentication 
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for the token in the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided. Authorization denied.' });
        }
        const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer token'
        if (!token) {
            return res.status(401).json({ message: 'No token provided. Authorization denied.' });
        }
        req.user = (0, jwtHelper_1.verifyToken)(token);
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token. Authorization denied.' });
    }
});
exports.authenticate = authenticate;
