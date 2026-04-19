import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
        validateAuthHeader(req.headers.authorization);
        const token = extractToken(req.headers.authorization!);
        req.user = verifyToken(token);
        next();
    } catch (e) {
        res.status(401).json({ error: "Credenciais inválidas" });
    }
}

function validateAuthHeader(header?: string): void {
    if (!header) throw new Error("Missing header");
    if (!header.startsWith("Bearer ")) throw new Error("Invalid format");
}

function extractToken(header: string): string {
    return header.split(" ")[1];
}
