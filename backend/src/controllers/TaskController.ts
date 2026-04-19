import { Response } from "express";
import { TaskService } from "../services/TaskService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class TaskController {
    private service = new TaskService();

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const task = await this.service.createTask(req.body, req.user.id);
            res.status(201).json(task);
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    async listByProject(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.service.listTasksByProject(req.params.projectId, req.user.id, page, limit);
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
            console.log(`Task Update requested for ID: ${req.params.id} by user: ${req.user.id} with body:`, req.body);
            await this.service.updateTask(req.params.id, req.user.id, req.body);
            res.status(200).json({ message: "Task updated" });
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
            await this.service.deleteTask(req.params.id, req.user.id);
            res.status(200).json({ message: "Task deleted" });
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: unknown): void {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        const status = message === "Task Not Found" || message === "Project Not Found" ? 404 : 
                      message === "Unauthorized" ? 401 : 400;
        res.status(status).json({ error: message });
    }
}
