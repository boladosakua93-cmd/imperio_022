"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Wrench, Users, DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp, Plus } from "lucide-react";

type Stats = {
  aguardando: number;
  em_servico: number;
  concluido: number;
  hoje: number;
  recebidoHoje: number;
  pendenteHoje: number;
};

type Ordem = {
  id: string;
  numero: number;
  nomeCliente: string;
  modeloVeiculo: string;
  placaVeiculo: string;
  servicoNome: string;
  servicoPreco: number;
  funcionarioNome: string;
  status: string;
  statusPagamento: string;
  entradaEm: string;
};

const fmtMoeda = (centavos: number) =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function DashboardPage() {
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ordens").then(r => r.json()).then(data => {
      setOrdens(data);
      setLoading(false);
    });
  }, []);

  const hoje = new Date().toISOString().split("T")[0];
  const ordensHoje = ordens.filter(o => o.entradaEm.startsWith(hoje));
  const stats: Stats = {
    aguardando: ordens.filter(o => o.status === "aguardando").length,
    em_servico: ordens.filter(o => o.status === "em_servico").length,
    concluido: ordens.filter(o => o.status === "concluido").length,
    hoje: ordensHoje.length,
    recebidoHoje: ordensHoje.filter(o => o.statusPagamento === "pago").reduce((s, o) => s + o.servicoPreco, 0),
    pendenteHoje: ordensHoje.filter(o => o.statusPagamento === "pendente").reduce((s, o) => s + o.servicoPreco, 0),
  };

  const ativas = ordens.filter(o => o.status === "aguardando" || o.status === "em_servico");

  const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
    aguardando: { label: "Aguardando", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    em_servico: { label: "Em Serviço", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
    concluido: { label: "Concluído", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
    entregue: { label: "Entregue", color: "#A0A0A0", bg: "rgba(160,160,160,0.08)" },
  };

  return (
    <div>
      <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: "#555", fontSize: 14 }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link href="/sistema/ordens" className="btn-primary" style={{ fontSize: 14, padding: "10px 20px" }}>
          <Plus size={16} /> Nova Entrada
        </Link>
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 32 }}>
        {[
          { label: "Aguardando", value: stats.aguardando, icon: Clock, color: "#f59e0b", link: "/sistema/ordens?status=aguardando" },
          { label: "Em Serviço", value: stats.em_servico, icon: Wrench, color: "#3b82f6", link: "/sistema/ordens?status=em_servico" },
          { label: "Concluídos hoje", value: stats.concluido, icon: CheckCircle, color: "#22c55e", link: "/sistema/ordens" },
          { label: "Entradas hoje", value: stats.hoje, icon: Car, color: "#e01e1e", link: "/sistema/ordens" },
          { label: "Recebido hoje", value: fmtMoeda(stats.recebidoHoje), icon: DollarSign, color: "#22c55e", link: "/sistema/financeiro" },
          { label: "Pendente hoje", value: fmtMoeda(stats.pendenteHoje), icon: AlertCircle, color: "#f59e0b", link: "/sistema/financeiro" },
        ].map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.link} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "18px 20px",
                cursor: "pointer",
                transition: "border-color 200ms",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(224,30,30,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</span>
                  <Icon size={16} color={card.color} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: card.color, letterSpacing: "-0.5px" }}>{card.value}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Veículos ativos */}
      <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Veículos no Pátio</h2>
          <Link href="/sistema/ordens" style={{ color: "#e01e1e", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
            Ver todos →
          </Link>
        </div>
        {loading ? (
          <div style={{ color: "#555", textAlign: "center", padding: 32 }}>Carregando...</div>
        ) : ativas.length === 0 ? (
          <div style={{ color: "#555", textAlign: "center", padding: 40 }}>
            <Car size={40} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
            <p>Nenhum veículo no pátio agora</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ativas.map(o => {
              const st = statusLabel[o.status] ?? statusLabel.aguardando;
              return (
                <div key={o.id} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "14px 16px", background: "#111",
                  borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)",
                  flexWrap: "wrap",
                }}>
                  <div style={{
                    background: st.bg, borderRadius: 100,
                    padding: "4px 12px", fontSize: 12, fontWeight: 700, color: st.color,
                    flexShrink: 0,
                  }}>{st.label}</div>
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>#{o.numero} — {o.modeloVeiculo}</div>
                    <div style={{ color: "#555", fontSize: 12 }}>{o.nomeCliente} {o.placaVeiculo ? `· ${o.placaVeiculo}` : ""}</div>
                  </div>
                  <div style={{ color: "#A0A0A0", fontSize: 13 }}>{o.servicoNome}</div>
                  {o.funcionarioNome && (
                    <div style={{ color: "#555", fontSize: 12 }}>{o.funcionarioNome}</div>
                  )}
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#22c55e" }}>{fmtMoeda(o.servicoPreco)}</div>
                  <Link href="/sistema/ordens" style={{
                    background: "rgba(224,30,30,0.1)", border: "1px solid rgba(224,30,30,0.3)",
                    borderRadius: 8, padding: "6px 14px",
                    color: "#e01e1e", fontSize: 12, fontWeight: 600, textDecoration: "none",
                  }}>Gerenciar</Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
