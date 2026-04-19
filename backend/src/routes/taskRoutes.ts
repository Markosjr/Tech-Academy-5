import { Router, Request, Response } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

export const router = Router();
const ctrl = new TaskController();

router.use(authMiddleware);

router.post("/", (req: Request, res: Response) => ctrl.create(req as AuthRequest, res));
router.get("/project/:projectId", (req: Request, res: Response) => ctrl.listByProject(req as AuthRequest, res));
router.put("/:id", (req: Request, res: Response) => ctrl.update(req as AuthRequest, res));
router.delete("/:id", (req: Request, res: Response) => ctrl.delete(req as AuthRequest, res));
