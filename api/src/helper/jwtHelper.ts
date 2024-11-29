import jwt from 'jsonwebtoken'

const secret: string = process.env.JWT_SECRET || "nasnnewDFdkKsjnfSDfSDjkfn";

// Generating accessToken for the user
export const accessToken = (userId: any, role: string): string => {
    return jwt.sign({ userId, role }, secret, { expiresIn: '1h' });
};

// Verifying the user accessToken and return the decoded token back
export const verifyToken = (token: string): { userId: string, role: string } => {
    try {
        const decoded = jwt.verify(token, secret) as { userId: string, role : string };
        return decoded;
    } catch (err) {
        throw new Error('Invalid token');
    }
};