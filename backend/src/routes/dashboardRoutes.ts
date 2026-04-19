import { Router, Request, Response } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

export const router = Router();
const ctrl = new DashboardController();

router.get("/stats", authMiddleware, (req: Request, res: Response) => ctrl.getStats(req as AuthRequest, res));
