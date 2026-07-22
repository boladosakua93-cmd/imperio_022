"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { LogIn, Eye, EyeOff, Lock, User, ShieldCheck, UserCircle } from "lucide-react";

function LoginContent() {
  const [form, setForm] = useState({ usuario: "", senha: "" });
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        const destination = data.role === 'funcionario'
          ? '/sistema/ordens'
          : '/sistema/dashboard';
        window.location.href = destination;
      } else {
        setError(data.error || "Credenciais inválidas");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "#1c1c1c",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "13px 16px 13px 44px",
    color: "#fff",
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 150ms",
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "Inter, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 50% 40%, rgba(224,30,30,0.06) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image src="/logo.png" alt="Império 022" width={140} height={76} style={{ objectFit: "contain", margin: "0 auto" }} />
          <p style={{ color: "#555", fontSize: 13, marginTop: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px" }}>
            Sistema Interno
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "32px 28px",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
            Bem-vindo de volta
          </h2>
          <p style={{ color: "#555", fontSize: 14, marginBottom: 20 }}>
            Entre com suas credenciais para acessar o sistema
          </p>

          {/* Perfis disponíveis */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <div style={{ flex: 1, background: "rgba(224,30,30,0.07)", border: "1px solid rgba(224,30,30,0.2)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={15} color="#e01e1e" />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#e01e1e", textTransform: "uppercase", letterSpacing: "0.5px" }}>Admin</div>
                <div style={{ fontSize: 11, color: "#555" }}>Acesso total</div>
              </div>
            </div>
            <div style={{ flex: 1, background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <UserCircle size={15} color="#3b82f6" />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.5px" }}>Funcionário</div>
                <div style={{ fontSize: 11, color: "#555" }}>Ordens de serviço</div>
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#ef4444",
              fontSize: 14,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
              <input
                type="text"
                placeholder="Usuário"
                value={form.usuario}
                autoComplete="username"
                onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "rgba(224,30,30,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
              <input
                type={showSenha ? "text" : "password"}
                placeholder="Senha"
                value={form.senha}
                autoComplete="current-password"
                onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = "rgba(224,30,30,0.5)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#555", cursor: "pointer" }}
              >
                {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !form.usuario || !form.senha}
              className="btn-primary"
              style={{
                marginTop: 8,
                opacity: loading || !form.usuario || !form.senha ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                justifyContent: "center",
              }}
            >
              {loading ? "Entrando..." : <><LogIn size={18} /> Entrar no Sistema</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a" }} />}>
      <LoginContent />
    </Suspense>
  );
}
