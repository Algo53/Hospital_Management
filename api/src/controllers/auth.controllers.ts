import { Request, Response } from "express";
import User, { IUser } from "../lib/models/User";
import { comparePassword, hashPassword } from "../helper/bcryptHelper";
import { accessToken } from "../helper/jwtHelper";
import Admin from "../lib/models/Admin";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, companyName, phone, gender, dateOfBirth } = req.body;

        // Validate required fields
        if (!firstName || !email || !password || !companyName || !phone || !gender || !dateOfBirth) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user
        const newUser: IUser = new User({
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
        const us = await newUser.save();
        
        // create and save new admin
        const newAdmin = await Admin.create({
            companyName: [companyName],
            userId: us._id
        })

        // Send a success response
        res.status(200).json({ 
            success: true,
            message: 'User registered successfully'
        });
        return;
    } catch (error) {
        res.status(500).json({  success: false, message: 'Server error' });
        return
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'All fields are required' });
            return
        }

        // Check if the user exists with the provided email or not
        const user = await User.findOne({ email });
        if (!user) { 
            res.status(400).json({ success: false, message: 'Invalid Credentials!'})
            return
        }
    
        // comparing the user enter password with the original
        const hashedPassword = await comparePassword(password, user.password);
        if (!hashedPassword) {
            res.status(400).json({ success: false, message: 'Invalid Credentials!'})
            return
        }

        // Generate the jwt token and send it to the client
        const token = accessToken(user._id, user.role);
        // Send a success response
        res.status(200).json({ 
            success: true,
            accessToken: token,
            role: user.role,
            message: 'User login successfully'
        });
    } catch (error) {
        res.status(500).json({  success: false, message: 'Server error' });
        return
    }
}

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        
    } catch (error) {
        res.status(500).json({  success: false, message: 'Server error' });
        return
    }
}