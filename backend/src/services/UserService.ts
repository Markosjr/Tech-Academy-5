import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
import { validateCPF } from "../utils/cpfValidator";
import bcrypt from "bcryptjs";

export class UserService {
    private repo = new UserRepository();

    async createUser(data: Partial<User>): Promise<User> {
        this.validateCreationData(data);
        await this.checkUniqueness(data.email!, data.cpf!);
        data.password = await this.hashPassword(data.password!);
        return await this.repo.create(data);
    }

    async updateSelf(id: string, data: Partial<User>): Promise<void> {
        this.validateUpdate(data);
        await this.ensureUserExists(id);
        if (data.password) data.password = await this.hashPassword(data.password);
        await this.repo.update(id, data);
    }

    async findAll(page: number, limit: number): Promise<{ users: User[], total: number, page: number, limit: number }> {
        const skip = (page - 1) * limit;
        const [users, total] = await this.repo.findAll(limit, skip);
        return { users, total, page, limit };
    }

    private validateCreationData(data: Partial<User>): void {
        if (!data.name || !data.email || !data.password || !data.cpf) throw new Error("Missing fields");
        this.validateEmail(data.email);
        this.validatePassword(data.password);
        this.validateCpf(data.cpf);
    }

    private validateUpdate(data: Partial<User>): void {
        if (data.email) throw new Error("Email cannot be changed");
        if (!data.name || !data.cpf) throw new Error("Missing required fields");
        if (data.password) this.validatePassword(data.password);
        if (data.cpf) this.validateCpf(data.cpf);
    }

    private validateEmail(email: string): void {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) throw new Error("Invalid email format");
    }

    private validatePassword(password: string): void {
        if (password.length < 8) throw new Error("Password too weak");
    }

    private validateCpf(cpf: string): void {
        if (!validateCPF(cpf)) throw new Error("Invalid CPF");
    }

    private async checkUniqueness(email: string, cpf: string): Promise<void> {
        if (await this.repo.findByEmail(email)) throw new Error("Email exists");
        if (await this.repo.findByCpf(cpf)) throw new Error("CPF exists");
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    private async ensureUserExists(id: string): Promise<User> {
        const user = await this.repo.findById(id);
        if (!user) throw new Error("User Not Found");
        return user;
    }
}
