import React, { createContext, useContext, useMemo, useState } from "react"
import type { AuthContextValue, AuthState, LoginPayload } from "../@types/auth"
import type { User } from "../@types/user"
import { getToken, getUser, setToken, setUser, clearAuth } from "../services/authStorage"

const AuthContext = createContext<AuthContextValue | null>(null)

const initialState: AuthState = {
  token: getToken(),
  user: getUser(),
  isAuthenticated: Boolean(getToken()),
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [tokenState, setTokenState] = useState<string | null>(initialState.token)
  const [userState, setUserState] = useState<User | null>(initialState.user)

  const isAuthenticated = Boolean(tokenState)

  async function login(payload: LoginPayload): Promise<void> {
    const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Falha ao realizar login.");
    }

    const { token, user } = data;

    setToken(token);
    setUser(user);

    setTokenState(token);
    setUserState(user);
  }

  function logout(): void {
    clearAuth()
    setTokenState(null)
    setUserState(null)
  }

  const value = useMemo<AuthContextValue>(() => {
    return {
      token: tokenState,
      user: userState,
      isAuthenticated,
      login,
      logout,
    }
  }, [tokenState, userState, isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}