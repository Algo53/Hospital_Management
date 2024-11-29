import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../helper/jwtHelper";
import { userInfo } from "os";

export const isAdminCheck = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

        const userInfo = verifyToken(token);
        if(userInfo.role !== 'Admin') {
            return res.status(400).json({ success: false, message: "Unauthorized Access!"});
        }

        (req as any).user = userInfo.userId;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Server Error! Try after some time' });
    }
}