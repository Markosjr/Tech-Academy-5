import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

type Mode = "LOGIN" | "REGISTER"

interface LoginFormState {
  email: string
  password: string
}

interface RegisterFormState {
  name: string
  cpf: string
  email: string
  password: string
  confirmPassword: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "")
}

function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  const p1 = digits.slice(0, 3)
  const p2 = digits.slice(3, 6)
  const p3 = digits.slice(6, 9)
  const p4 = digits.slice(9, 11)

  if (digits.length <= 3) return p1
  if (digits.length <= 6) return `${p1}.${p2}`
  if (digits.length <= 9) return `${p1}.${p2}.${p3}`
  return `${p1}.${p2}.${p3}-${p4}`
}

function isValidCpf(cpf: string): boolean {
  const c = onlyDigits(cpf)
  if (c.length !== 11) return false
  if (/^(\d)\1{10}$/.test(c)) return false

  const calcDigit = (base: string, factor: number): number => {
    let total = 0
    for (let i = 0; i < base.length; i++) {
      total += Number(base[i]) * (factor - i)
    }
    const mod = total % 11
    return mod < 2 ? 0 : 11 - mod
  }

  const d1 = calcDigit(c.slice(0, 9), 10)
  const d2 = calcDigit(c.slice(0, 10), 11)
  return c.endsWith(`${d1}${d2}`)
}

function passwordLevelError(password: string): string | null {
  if (password.length < 8) return "Senha deve conter pelo menos 8 caracteres."
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length
  if (score < 3) return "Use letras maiúsculas/minúsculas, número e/ou símbolo (mínimo 3 tipos)."
  return null
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [mode, setMode] = useState<Mode>("LOGIN")

  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const title = useMemo(() => (mode === "LOGIN" ? "Login" : "Cadastro"), [mode])
  const subtitle = useMemo(
    () =>
      mode === "LOGIN"
        ? "Entre para acessar suas tarefas."
        : "Crie sua conta para começar a organizar suas tarefas.",
    [mode]
  )

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setSuccess(null)
  }

  function onChangeLogin(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  function onChangeRegister(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    if (name === "cpf") {
      setRegisterForm((p) => ({ ...p, cpf: formatCpf(value) }))
      return
    }

    setRegisterForm((p) => ({ ...p, [name]: value }))
  }

  function validateLoginForm(): string | null {
    if (!loginForm.email) return "E-mail é obrigatório."
    if (!emailRegex.test(loginForm.email)) return "E-mail inválido."
    if (!loginForm.password) return "Senha é obrigatória."
    return null
  }

  function validateRegisterForm(): string | null {
    if (!registerForm.name) return "Nome é obrigatório."
    if (!registerForm.cpf) return "CPF é obrigatório."
    if (!isValidCpf(registerForm.cpf)) return "CPF inválido."

    if (!registerForm.email) return "E-mail é obrigatório."
    if (!emailRegex.test(registerForm.email)) return "E-mail inválido."

    if (!registerForm.password) return "Senha é obrigatória."
    const pwdErr = passwordLevelError(registerForm.password)
    if (pwdErr) return pwdErr

    if (!registerForm.confirmPassword) return "Confirmação de senha é obrigatória."
    if (registerForm.confirmPassword !== registerForm.password) return "As senhas não coincidem."
    return null
  }

  async function onSubmitLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const err = validateLoginForm()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    try {
      await login({ email: loginForm.email, password: loginForm.password })
      navigate("/dashboard", { replace: true })
    } catch (err2) {
      const message = err2 instanceof Error ? err2.message : "Erro ao fazer login."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const err = validateRegisterForm()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
      const response = await fetch(`${apiUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerForm.name,
          cpf: registerForm.cpf.replace(/\D/g, ""),
          email: registerForm.email,
          password: registerForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar.");
      }

      setSuccess("Cadastro realizado! Agora faça login.");
      setMode("LOGIN")
      setLoginForm({ email: registerForm.email, password: "" })
      setRegisterForm({ name: "", cpf: "", email: "", password: "", confirmPassword: "" })
    } catch (err2: unknown) {
      const message = err2 instanceof Error ? err2.message : "Erro ao cadastrar. Tente novamente."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        background:
          "radial-gradient(1000px 500px at 20% 0%, rgba(109,94,252,.25), transparent 55%), var(--bg)",
      }}
    >
      <div className="surface" style={{ width: "100%", maxWidth: 460, padding: 22 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <button
            type="button"
            onClick={() => switchMode("LOGIN")}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: mode === "LOGIN" ? "rgba(109,94,252,.18)" : "rgba(255,255,255,.03)",
              color: "var(--text)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode("REGISTER")}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: mode === "REGISTER" ? "rgba(109,94,252,.18)" : "rgba(255,255,255,.03)",
              color: "var(--text)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Cadastro
          </button>
        </div>

        <h1 style={{ margin: 0 }}>{title}</h1>
        <p className="muted" style={{ marginTop: 8 }}>
          {subtitle}
        </p>

        {error && (
          <div style={{ marginTop: 10, color: "rgba(255,77,79,.95)", fontSize: 13 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginTop: 10, color: "rgba(34,197,94,.95)", fontSize: 13 }}>
            {success}
          </div>
        )}

        {mode === "LOGIN" ? (
          <form onSubmit={onSubmitLogin} style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <input
              name="email"
              placeholder="E-mail"
              value={loginForm.email}
              onChange={onChangeLogin}
              style={{
                height: 44,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.03)",
                padding: "0 12px",
                color: "var(--text)",
              }}
            />

            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={loginForm.password}
                onChange={onChangeLogin}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,.03)",
                  padding: "0 40px 0 12px",
                  color: "var(--text)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: 0,
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                height: 44,
                borderRadius: 12,
                border: 0,
                background: "rgba(109,94,252,.95)",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmitRegister} style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <input
              name="name"
              placeholder="Nome completo"
              value={registerForm.name}
              onChange={onChangeRegister}
              style={{
                height: 44,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.03)",
                padding: "0 12px",
                color: "var(--text)",
              }}
            />

            <input
              name="cpf"
              placeholder="CPF"
              value={registerForm.cpf}
              onChange={onChangeRegister}
              style={{
                height: 44,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.03)",
                padding: "0 12px",
                color: "var(--text)",
              }}
            />

            <input
              name="email"
              placeholder="E-mail"
              value={registerForm.email}
              onChange={onChangeRegister}
              style={{
                height: 44,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,.03)",
                padding: "0 12px",
                color: "var(--text)",
              }}
            />

            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha (forte)"
                value={registerForm.password}
                onChange={onChangeRegister}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,.03)",
                  padding: "0 40px 0 12px",
                  color: "var(--text)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: 0,
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            <div style={{ position: "relative" }}>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={registerForm.confirmPassword}
                onChange={onChangeRegister}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,.03)",
                  padding: "0 40px 0 12px",
                  color: "var(--text)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: 0,
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                height: 44,
                borderRadius: 12,
                border: 0,
                background: "rgba(34,197,94,.90)",
                color: "#081019",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}