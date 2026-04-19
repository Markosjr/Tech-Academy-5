import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";
import { Task, TaskStatus } from "../entities/Task";

export interface IDashboardStats {
    totalProjects: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
}

export class DashboardService {
    async getStats(userId: string): Promise<IDashboardStats> {
        const totalProjects = await AppDataSource.getRepository(Project).countBy({ userId });
        
        const taskRepo = AppDataSource.getRepository(Task);
        
        const totalTasks = await taskRepo.createQueryBuilder("task")
            .innerJoin("task.project", "project")
            .where("project.userId = :userId", { userId })
            .getCount();
        
        const pendingTasks = await taskRepo.createQueryBuilder("task")
            .innerJoin("task.project", "project")
            .where("project.userId = :userId", { userId })
            .andWhere("task.status IN (:...statuses)", { statuses: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] })
            .getCount();

        const completedTasks = await taskRepo.createQueryBuilder("task")
            .innerJoin("task.project", "project")
            .where("project.userId = :userId", { userId })
            .andWhere("task.status = :status", { status: TaskStatus.COMPLETED })
            .getCount();

        return { totalProjects, totalTasks, pendingTasks, completedTasks };
    }
}
