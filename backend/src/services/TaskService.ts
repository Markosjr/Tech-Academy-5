import { TaskRepository } from "../repositories/TaskRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { Task } from "../entities/Task";

export class TaskService {
    private repo = new TaskRepository();
    private projectRepo = new ProjectRepository();

    async createTask(data: Partial<Task>, userId: string): Promise<Task> {
        await this.validateProjectAccess(data.projectId!, userId);
        this.validateTaskData(data);
        return await this.repo.create(data);
    }

    async listTasksByProject(projectId: string, userId: string, page: number, limit: number): Promise<{ tasks: Task[], total: number, page: number, limit: number }> {
        await this.validateProjectAccess(projectId, userId);
        const skip = (page - 1) * limit;
        const [tasks, total] = await this.repo.findByProjectId(projectId, limit, skip);
        return { tasks, total, page, limit };
    }

    async updateTask(id: string, userId: string, data: Partial<Task>): Promise<void> {
        await this.ensureOwnership(id, userId);
        if (data.title !== undefined && !data.title) throw new Error("Task title cannot be empty");
        await this.repo.update(id, data);
    }

    async deleteTask(id: string, userId: string): Promise<void> {
        await this.ensureOwnership(id, userId);
        await this.repo.delete(id);
    }

    private validateTaskData(data: Partial<Task>): void {
        if (!data.title) throw new Error("Task title is required");
    }

    private async validateProjectAccess(projectId: string, userId: string): Promise<void> {
        const project = await this.projectRepo.findById(projectId);
        if (!project) throw new Error("Project Not Found");
        if (project.userId !== userId) throw new Error("Unauthorized");
    }

    private async ensureOwnership(id: string, userId: string): Promise<void> {
        const task = await this.repo.findById(id);
        if (!task) throw new Error("Task Not Found");
        await this.validateProjectAccess(task.projectId, userId);
    }
}
