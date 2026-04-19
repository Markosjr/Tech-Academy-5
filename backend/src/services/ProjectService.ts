import { ProjectRepository } from "../repositories/ProjectRepository";
import { Project } from "../entities/Project";

export class ProjectService {
    private repo = new ProjectRepository();

    async createProject(data: Partial<Project>): Promise<Project> {
        this.validateProjectData(data);
        return await this.repo.create(data);
    }

    async listUserProjects(userId: string, page: number, limit: number): Promise<{ projects: Project[], total: number, page: number, limit: number }> {
        const skip = (page - 1) * limit;
        const [projects, total] = await this.repo.findByUserId(userId, limit, skip);
        return { projects, total, page, limit };
    }

    async updateProject(id: string, userId: string, data: Partial<Project>): Promise<void> {
        await this.ensureOwnership(id, userId);
        this.validateProjectData(data);
        await this.repo.update(id, data);
    }

    async deleteProject(id: string, userId: string): Promise<void> {
        await this.ensureOwnership(id, userId);
        await this.repo.delete(id);
    }

    private validateProjectData(data: Partial<Project>): void {
        if (!data.title) throw new Error("Project title is required");
    }

    private async ensureOwnership(id: string, userId: string): Promise<Project> {
        const project = await this.repo.findById(id);
        if (!project) throw new Error("Project Not Found");
        if (project.userId !== userId) throw new Error("Unauthorized");
        return project;
    }
}
