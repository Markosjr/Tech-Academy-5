interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {children}
    </div>
  )
}