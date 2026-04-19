import type { User } from "./user"

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}