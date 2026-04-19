import { AppDataSource } from "../data-source";
import { Task } from "../entities/Task";

export class TaskRepository {
    private repo = AppDataSource.getRepository(Task);

    async create(data: Partial<Task>): Promise<Task> {
        const task = this.repo.create(data);
        return await this.repo.save(task);
    }

    async findById(id: string): Promise<Task | null> {
        return await this.repo.findOneBy({ id });
    }

    async findByProjectId(projectId: string, take: number, skip: number): Promise<[Task[], number]> {
        return await this.repo.findAndCount({
            where: { projectId },
            take,
            skip
        });
    }

    async update(id: string, data: Partial<Task>): Promise<void> {
        await this.repo.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
