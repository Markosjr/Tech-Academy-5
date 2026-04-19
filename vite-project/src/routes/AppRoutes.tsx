import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import PrivateRoute from "./PrivateRoute"
import AppShell from "../layout/AppShell"
import ProjectsList from "../pages/projects/ProjectsList"
import ProjectForm from "../pages/projects/ProjectForm"
import ProjectDetails from "../pages/projects/ProjectDetails"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projetos" element={<ProjectsList />} />
            <Route path="/projetos/novo" element={<ProjectForm mode="create" />} />
            <Route path="/projetos/:id" element={<ProjectDetails />} />
            <Route path="/projetos/:id/editar" element={<ProjectForm mode="edit" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}