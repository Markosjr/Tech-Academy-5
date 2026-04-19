import { Response } from "express";
import { UserService } from "../services/UserService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class UserController {
    private service = new UserService();

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user = await this.service.createUser(req.body);
            res.status(201).json(this.sanitizeUser(user));
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            await this.service.updateSelf(req.user.id, req.body);
            res.status(200).json({ message: "Updated" });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error";
            if (message === "User Not Found") res.status(404).json({ error: "Not Found" });
            else this.handleError(res, error);
        }
    }

    async findAll(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.service.findAll(page, limit);
            res.status(200).json(result);
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    private sanitizeUser(user: { password?: string }): object {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    private handleError(res: Response, error: unknown): void {
        const message = error instanceof Error ? error.message : "Error";
        res.status(400).json({ error: message });
    }
}
