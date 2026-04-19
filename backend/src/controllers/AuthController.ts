import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
    private service = new AuthService();

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.service.login(req.body.email, req.body.password);
            res.status(200).json(result);
        } catch (error: unknown) {
            res.status(401).json({ error: "Credenciais inválidas" });
        }
    }
}
