"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Users, Wrench, Calendar } from "lucide-react";

type FinData = {
  totalServicos: number;
  totalRecebido: number;
  totalPendente: number;
  totalComissoes: number;
  lucro: number;
  porFuncionario: { nome: string; servicos: number; comissao: number }[];
  porServico: { nome: string; qtd: number; total: number }[];
};

const fmtMoeda = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function FinanceiroPage() {
  const [data, setData] = useState<FinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inicio, setInicio] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split("T")[0];
  });
  const [fim, setFim] = useState(() => new Date().toISOString().split("T")[0]);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ inicio, fim });
    const d = await fetch(`/api/financeiro?${params}`).then(r => r.json());
    setData(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, [inicio, fim]);

  const periodos = [
    { label: "Hoje", onClick: () => { const t = new Date().toISOString().split("T")[0]; setInicio(t); setFim(t); } },
    { label: "Esta semana", onClick: () => { const d = new Date(); const d0 = new Date(d); d0.setDate(d.getDate() - d.getDay()); setInicio(d0.toISOString().split("T")[0]); setFim(d.toISOString().split("T")[0]); } },
    { label: "Este mês", onClick: () => { const d = new Date(); const d0 = new Date(d.getFullYear(), d.getMonth(), 1); setInicio(d0.toISOString().split("T")[0]); setFim(d.toISOString().split("T")[0]); } },
    { label: "Mês passado", onClick: () => { const d = new Date(); const d0 = new Date(d.getFullYear(), d.getMonth() - 1, 1); const d1 = new Date(d.getFullYear(), d.getMonth(), 0); setInicio(d0.toISOString().split("T")[0]); setFim(d1.toISOString().split("T")[0]); } },
  ];

  const inputS: React.CSSProperties = { background: "#1c1c1c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", colorScheme: "dark" };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Financeiro</h1>
        <p style={{ color: "#555", fontSize: 14 }}>Resumo de receitas, despesas e comissões</p>
      </div>

      {/* Period selector */}
      <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {periodos.map(p => (
            <button key={p.label} onClick={p.onClick}
              style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#A0A0A0", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: "auto" }}>
          <Calendar size={15} color="#555" />
          <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} style={inputS} />
          <span style={{ color: "#555" }}>→</span>
          <input type="date" value={fim} onChange={e => setFim(e.target.value)} style={inputS} />
        </div>
      </div>

      {loading ? (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>Carregando...</div>
      ) : !data ? null : (
        <>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total de Serviços", value: data.totalServicos, color: "#e01e1e", icon: Wrench, fmt: false },
              { label: "Receita Recebida", value: fmtMoeda(data.totalRecebido), color: "#22c55e", icon: TrendingUp, fmt: true },
              { label: "A Receber (Pendente)", value: fmtMoeda(data.totalPendente), color: "#f59e0b", icon: DollarSign, fmt: true },
              { label: "Total em Comissões", value: fmtMoeda(data.totalComissoes), color: "#3b82f6", icon: Users, fmt: true },
              { label: "Lucro Líquido", value: fmtMoeda(data.lucro), color: data.lucro >= 0 ? "#22c55e" : "#ef4444", icon: TrendingDown, fmt: true },
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.label} style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</span>
                    <Icon size={16} color={card.color} />
                  </div>
                  <div style={{ fontSize: card.fmt ? 20 : 32, fontWeight: 800, color: card.color, letterSpacing: "-0.5px" }}>{card.value}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {/* Por funcionário */}
            <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} color="#3b82f6" /> Comissões por Funcionário
              </h3>
              {data.porFuncionario.length === 0 ? (
                <p style={{ color: "#555", fontSize: 14 }}>Nenhum dado no período</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.porFuncionario.sort((a, b) => b.comissao - a.comissao).map(f => (
                    <div key={f.nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#111", borderRadius: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{f.nome}</div>
                        <div style={{ color: "#555", fontSize: 12 }}>{f.servicos} serviço(s)</div>
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#3b82f6" }}>{fmtMoeda(f.comissao)}</div>
                    </div>
                  ))}
                  <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#555", fontSize: 13 }}>Total</span>
                    <span style={{ fontWeight: 800, color: "#3b82f6", fontSize: 16 }}>{fmtMoeda(data.totalComissoes)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Por serviço */}
            <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 22 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <Wrench size={18} color="#e01e1e" /> Serviços Realizados
              </h3>
              {data.porServico.length === 0 ? (
                <p style={{ color: "#555", fontSize: 14 }}>Nenhum dado no período</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.porServico.sort((a, b) => b.total - a.total).map(s => {
                    const maxTotal = Math.max(...data.porServico.map(x => x.total));
                    const pct = maxTotal > 0 ? (s.total / maxTotal) * 100 : 0;
                    return (
                      <div key={s.nome}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{s.nome}</span>
                            <span style={{ color: "#555", fontSize: 12, marginLeft: 8 }}>{s.qtd}x</span>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#22c55e" }}>{fmtMoeda(s.total)}</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "var(--gradient-brand)", borderRadius: 2 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
