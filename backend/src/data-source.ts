import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "agendafacil",
    synchronize: true,
    logging: false,
    entities: [User, Project, Task],
    migrations: [],
    subscribers: [],
});
