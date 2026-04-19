import { Router, Request, Response } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

export const router = Router();
const ctrl = new ProjectController();

router.use(authMiddleware);

router.post("/", (req: Request, res: Response) => ctrl.create(req as AuthRequest, res));
router.get("/", (req: Request, res: Response) => ctrl.list(req as AuthRequest, res));
router.put("/:id", (req: Request, res: Response) => ctrl.update(req as AuthRequest, res));
router.delete("/:id", (req: Request, res: Response) => ctrl.delete(req as AuthRequest, res));
