import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class UserRepository {
    private repo = AppDataSource.getRepository(User);

    async create(data: Partial<User>): Promise<User> {
        const user = this.repo.create(data);
        return this.repo.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOneBy({ email });
    }

    async findByCpf(cpf: string): Promise<User | null> {
        return this.repo.findOneBy({ cpf });
    }

    async findById(id: string): Promise<User | null> {
        return this.repo.findOneBy({ id });
    }

    async findAll(take: number, skip: number): Promise<[User[], number]> {
        return this.repo.findAndCount({ take, skip });
    }

    async update(id: string, data: Partial<User>): Promise<void> {
        await this.repo.update(id, data);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
