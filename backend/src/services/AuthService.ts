import { UserRepository } from "../repositories/UserRepository";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";

export class AuthService {
    private repo = new UserRepository();

    async login(email?: string, password?: string): Promise<{ token: string, user: Partial<User> }> {
        this.validateInput(email, password);
        const user = await this.findUser(email!);
        await this.verifyPassword(password!, user.password);
        const { password: _, ...safeUser } = user;
        return {
            token: generateToken(user.id),
            user: safeUser
        };
    }

    private validateInput(email?: string, password?: string): void {
        if (!email || !password) throw new Error("Missing credentials");
    }

    private async findUser(email: string): Promise<User> {
        const user = await this.repo.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");
        return user;
    }

    private async verifyPassword(input: string, stored: string): Promise<void> {
        const valid = await bcrypt.compare(input, stored);
        if (!valid) throw new Error("Invalid credentials");
    }
}
