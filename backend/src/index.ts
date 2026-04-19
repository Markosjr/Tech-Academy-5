import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { router as userRoutes } from "./routes/userRoutes";
import { router as projectRoutes } from "./routes/projectRoutes";
import { router as taskRoutes } from "./routes/taskRoutes";
import { router as dashboardRoutes } from "./routes/dashboardRoutes";

const app = express();
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados sincronizado e conectado com sucesso! 🚀");
        app.listen(PORT, () => {
            console.log(`API Node.js rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Erro ao conectar no banco de dados: ", error);
        process.exit(1);
    });
