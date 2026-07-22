"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Car,
  Phone,
  CheckCircle,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  RefreshCw,
} from "lucide-react";

type Agendamento = {
  id: string;
  servicoNome: string;
  servicoPreco: number;
  data: string;
  horario: string;
  nomeCliente: string;
  telefone: string;
  tipoVeiculo: string;
  placa: string;
  modelo: string;
  observacoes: string;
  status: "pendente" | "confirmado" | "concluido" | "cancelado";
  criadoEm: string;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pendente: { label: "Pendente", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  confirmado: { label: "Confirmado", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: CheckCircle },
  concluido: { label: "Concluído", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle },
  cancelado: { label: "Cancelado", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
};

export default function AdminPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAg, setSelectedAg] = useState<Agendamento | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agendamentos");
      const data = await res.json();
      setAgendamentos(data.agendamentos || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch("/api/agendamentos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: status as Agendamento["status"] } : a));
      if (selectedAg?.id === id) setSelectedAg(prev => prev ? { ...prev, status: status as Agendamento["status"] } : null);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = agendamentos.filter(a => {
    const matchSearch = search === "" ||
      a.nomeCliente.toLowerCase().includes(search.toLowerCase()) ||
      a.modelo.toLowerCase().includes(search.toLowerCase()) ||
      a.placa.toLowerCase().includes(search.toLowerCase()) ||
      a.servicoNome.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: agendamentos.length,
    pendentes: agendamentos.filter(a => a.status === "pendente").length,
    confirmados: agendamentos.filter(a => a.status === "confirmado").length,
    concluidos: agendamentos.filter(a => a.status === "concluido").length,
    faturamento: agendamentos.filter(a => a.status === "concluido").reduce((acc, a) => acc + a.servicoPreco, 0),
  };

  const inputStyle: React.CSSProperties = {
    background: "#161616",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", fontFamily: "Inter, sans-serif", color: "#fff" }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 24px",
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 10,
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ color: "#A0A0A0", display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 14 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}>
            <ArrowLeft size={16} /> Início
          </Link>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/logo.png" alt="Império 022" width={70} height={38} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#A0A0A0" }}>Painel Admin</span>
          </div>
        </div>
        <button onClick={fetchData} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 14px", color: "#A0A0A0", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total de Agendamentos", value: stats.total, icon: Calendar, color: "#e01e1e" },
            { label: "Pendentes", value: stats.pendentes, icon: Clock, color: "#f59e0b" },
            { label: "Confirmados", value: stats.confirmados, icon: Users, color: "#3b82f6" },
            { label: "Concluídos", value: stats.concluidos, icon: TrendingUp, color: "#22c55e" },
            { label: "Faturamento", value: `R$ ${stats.faturamento}`, icon: DollarSign, color: "#e01e1e" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
                  <Icon size={16} color={stat.color} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: stat.color }}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
            <input
              placeholder="Buscar por nome, modelo, placa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 38, width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["todos", "pendente", "confirmado", "concluido", "cancelado"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{
                  padding: "9px 16px",
                  borderRadius: 8,
                  border: `1px solid ${filterStatus === s ? "rgba(224,30,30,0.5)" : "rgba(255,255,255,0.08)"}`,
                  background: filterStatus === s ? "rgba(224,30,30,0.1)" : "transparent",
                  color: filterStatus === s ? "#e01e1e" : "#A0A0A0",
                  fontSize: 13,
                  fontWeight: filterStatus === s ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 150ms",
                  textTransform: "capitalize",
                }}>
                {s === "todos" ? "Todos" : statusConfig[s]?.label || s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#555" }}>
            <RotateCcw size={32} style={{ margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
            Carregando agendamentos...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#555" }}>
            <Calendar size={48} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <div>Nenhum agendamento encontrado.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.sort((a, b) => {
              const statusOrder = { pendente: 0, confirmado: 1, concluido: 2, cancelado: 3 };
              return statusOrder[a.status] - statusOrder[b.status];
            }).map(ag => {
              const cfg = statusConfig[ag.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={ag.id}
                  onClick={() => setSelectedAg(selectedAg?.id === ag.id ? null : ag)}
                  style={{
                    background: "#161616",
                    border: `1px solid ${selectedAg?.id === ag.id ? "rgba(224,30,30,0.3)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 14,
                    padding: "18px 20px",
                    cursor: "pointer",
                    transition: "all 200ms",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    {/* Status */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: cfg.bg, borderRadius: 100, padding: "4px 12px",
                      flexShrink: 0,
                    }}>
                      <StatusIcon size={12} color={cfg.color} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{ag.nomeCliente}</div>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span style={{ color: "#A0A0A0", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                          <Car size={12} /> {ag.modelo} ({ag.tipoVeiculo})
                        </span>
                        {ag.placa && <span style={{ color: "#555", fontSize: 12 }}>{ag.placa}</span>}
                      </div>
                    </div>

                    {/* Service */}
                    <div style={{ textAlign: "center", minWidth: 130 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{ag.servicoNome}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#e01e1e", marginTop: 2 }}>R$ {ag.servicoPreco}</div>
                    </div>

                    {/* Date/Time */}
                    <div style={{ textAlign: "right", minWidth: 100 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#A0A0A0", fontSize: 13, justifyContent: "flex-end" }}>
                        <Calendar size={13} />
                        {new Date(ag.data + "T12:00:00").toLocaleDateString("pt-BR")}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#555", fontSize: 13, justifyContent: "flex-end", marginTop: 2 }}>
                        <Clock size={13} />
                        {ag.horario}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {selectedAg?.id === ag.id && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}
                      onClick={e => e.stopPropagation()}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
                        {[
                          { label: "Telefone", value: ag.telefone, icon: Phone },
                          { label: "Observações", value: ag.observacoes || "—", icon: Filter },
                        ].map(row => {
                          const Icon = row.icon;
                          return (
                            <div key={row.label}>
                              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#555", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <Icon size={11} /> {row.label}
                              </div>
                              <div style={{ fontSize: 14, color: "#ccc" }}>{row.value}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {ag.status === "pendente" && (
                          <button onClick={() => updateStatus(ag.id, "confirmado")} disabled={updatingId === ag.id}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle size={14} /> Confirmar
                          </button>
                        )}
                        {(ag.status === "pendente" || ag.status === "confirmado") && (
                          <button onClick={() => updateStatus(ag.id, "concluido")} disabled={updatingId === ag.id}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle size={14} /> Concluir
                          </button>
                        )}
                        {ag.status !== "cancelado" && ag.status !== "concluido" && (
                          <button onClick={() => updateStatus(ag.id, "cancelado")} disabled={updatingId === ag.id}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <XCircle size={14} /> Cancelar
                          </button>
                        )}
                        {ag.status === "cancelado" && (
                          <button onClick={() => updateStatus(ag.id, "pendente")} disabled={updatingId === ag.id}
                            style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#A0A0A0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <RotateCcw size={14} /> Reativar
                          </button>
                        )}
                        <a href={`https://wa.me/55${ag.telefone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                          style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid rgba(37,211,102,0.3)", background: "transparent", color: "#25d366", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                          <Phone size={14} /> WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
