import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helper/jwtHelper";

// Checking the authentication 
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

        (req as any).user = verifyToken(token);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token. Authorization denied.' });
    }
} 