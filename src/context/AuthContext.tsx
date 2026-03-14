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
    // ✅ por enquanto simula login (sem API)
    // depois a gente troca por chamada real ao backend

    // validação mínima
    if (!payload.email || !payload.password) {
      throw new Error("E-mail e senha são obrigatórios.")
    }

    // simulação de token + user
    const fakeToken = "token_teste_123"
    const fakeUser: User = {
      id: "1",
      name: "Usuário Teste",
      email: payload.email,
      cpf: "00000000000",
    }

    setToken(fakeToken)
    setUser(fakeUser)

    setTokenState(fakeToken)
    setUserState(fakeUser)
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