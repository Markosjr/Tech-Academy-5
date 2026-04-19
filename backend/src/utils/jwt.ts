import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "supersecret123";

export interface JwtPayload {
    id: string;
}

export function generateToken(userId: string): string {
    return jwt.sign({ id: userId }, secret, { expiresIn: '1d' });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, secret) as JwtPayload;
}
