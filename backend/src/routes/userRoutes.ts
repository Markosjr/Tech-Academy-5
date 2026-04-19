import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

export const router = Router();
const userCtrl = new UserController();
const authCtrl = new AuthController();

// Auth routes
router.post("/login", (req: Request, res: Response) => authCtrl.login(req, res));

// User routes
router.post("/register", (req: Request, res: Response) => userCtrl.create(req as AuthRequest, res));
router.put("/", authMiddleware, (req: Request, res: Response) => userCtrl.update(req as AuthRequest, res));
router.get("/", authMiddleware, (req: Request, res: Response) => userCtrl.findAll(req as AuthRequest, res));
