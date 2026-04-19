import { api } from "./api";

export interface DashboardStats {
    totalProjects: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    return await api.get<DashboardStats>("/dashboard/stats");
}
