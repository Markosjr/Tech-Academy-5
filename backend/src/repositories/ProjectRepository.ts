import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";

export class ProjectRepository {
    private repo = AppDataSource.getRepository(Project);

    async create(data: Partial<Project>): Promise<Project> {
        const project = this.repo.create(data);
        return await this.repo.save(project);
    }

    async findById(id: string): Promise<Project | null> {
        return await this.repo.findOneBy({ id });
    }

    async findByUserId(userId: string, take: number, skip: number): Promise<[Project[], number]> {
        return await this.repo.findAndCount({
            where: { userId },
            take,
            skip
        });
    }

    async update(id: string, data: Partial<Project>): Promise<void> {
        await this.repo.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
