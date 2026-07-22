"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Wrench,
  Users,
  DollarSign,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import "./sistema.css";

type Role = "admin" | "funcionario";

const allNav = [
  { href: "/sistema/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/sistema/ordens", label: "Entrada de Veículos", icon: Car, roles: ["admin", "funcionario"] },
  { href: "/sistema/servicos", label: "Serviços", icon: Wrench, roles: ["admin"] },
  { href: "/sistema/funcionarios", label: "Funcionários", icon: Users, roles: ["admin"] },
  { href: "/sistema/financeiro", label: "Financeiro", icon: DollarSign, roles: ["admin"] },
];

export default function SistemaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("admin");
  const [nome, setNome] = useState("");

  const isLoginPage = pathname === "/sistema/login";

  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/auth").then(r => r.json()).then(data => {
        if (data.authenticated) {
          setRole(data.role as Role);
          setNome(data.nome ?? "");
        }
      });
    }
  }, [isLoginPage]);

  const nav = allNav.filter(item => item.roles.includes(role));

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/sistema/login";
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const NavLinks = () => (
    <>
      {nav.map(item => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, marginBottom: 2,
              textDecoration: "none",
              background: active ? "rgba(224,30,30,0.1)" : "transparent",
              color: active ? "#e01e1e" : "#A0A0A0",
              fontWeight: active ? 600 : 400, fontSize: 14,
              border: active ? "1px solid rgba(224,30,30,0.2)" : "1px solid transparent",
            }}
          >
            <Icon size={18} /> {item.label}
          </Link>
        );
      })}
    </>
  );

  const SidebarHeader = () => (
    <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Link href={role === "admin" ? "/sistema/dashboard" : "/sistema/ordens"}>
        <Image src="/logo.png" alt="Império 022" width={100} height={54} style={{ objectFit: "contain" }} />
      </Link>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
        {role === "admin"
          ? <ShieldCheck size={13} color="#e01e1e" />
          : <UserCircle size={13} color="#3b82f6" />
        }
        <div>
          <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{nome}</div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: role === "admin" ? "#e01e1e" : "#3b82f6" }}>
            {role === "admin" ? "Administrador" : "Funcionário"}
          </div>
        </div>
      </div>
    </div>
  );

  const SidebarFooter = () => (
    <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
      {role === "admin" && (
        <Link href="/" style={{ color: "#555", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          ← Voltar ao site
        </Link>
      )}
      <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "#555", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
        <LogOut size={12} /> Sair
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", fontFamily: "Inter, sans-serif" }}>

      {/* Sidebar desktop */}
      <aside style={{
        width: 240, background: "#111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 40,
      }} className="hidden-mobile-sidebar">
        <SidebarHeader />
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          <NavLinks />
        </nav>
        <SidebarFooter />
      </aside>

      {/* Mobile top bar */}
      <div style={{
        display: "none",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "#111", borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "12px 16px", alignItems: "center", justifyContent: "space-between",
      }} className="mobile-topbar">
        <Image src="/logo.png" alt="Império 022" width={80} height={44} style={{ objectFit: "contain" }} />
        <button onClick={() => setOpen(!open)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(0,0,0,0.7)" }} onClick={() => setOpen(false)}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 240, background: "#111", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
            <SidebarHeader />
            <nav style={{ flex: 1, padding: "12px 8px" }}>
              <NavLinks />
            </nav>
            <SidebarFooter />
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, padding: "32px", minHeight: "100vh" }} className="sistema-main">
        {children}
      </main>
    </div>
  );
}

