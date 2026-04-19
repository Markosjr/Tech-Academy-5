import { Response } from "express";
import { ProjectService } from "../services/ProjectService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class ProjectController {
    private service = new ProjectService();

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const project = await this.service.createProject({ ...req.body, userId: req.user.id });
            res.status(201).json(project);
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    async list(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.service.listUserProjects(req.user.id, page, limit);
            res.status(200).json(result);
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
            await this.service.updateProject(req.params.id, req.user.id, req.body);
            res.status(200).json({ message: "Project updated" });
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            await this.service.deleteProject(req.params.id, req.user.id);
            res.status(200).json({ message: "Project deleted" });
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: unknown): void {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        const status = message === "Project Not Found" ? 404 : 
                      message === "Unauthorized" ? 401 : 400;
        res.status(status).json({ error: message });
    }
}
