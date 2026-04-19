import { Response } from "express";
import { DashboardService } from "../services/DashboardService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class DashboardController {
    private service = new DashboardService();

    async getStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Não autorizado" });
                return;
            }
            const stats = await this.service.getStats(req.user.id);
            console.log("Stats returned for user", req.user.id, ":", stats);
            res.status(200).json(stats);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            console.error("Dashboard Stats Error:", error);
            res.status(400).json({ error: message });
        }
    }
}
