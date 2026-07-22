"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Car, Clock, CheckCircle, Wrench, X, RefreshCw, ChevronDown } from "lucide-react";

type Ordem = {
  id: string; numero: number; nomeCliente: string; telefoneCliente: string;
  modeloVeiculo: string; placaVeiculo: string; corVeiculo: string;
  servicoId: string; servicoNome: string; servicoPreco: number;
  funcionarioId: string; funcionarioNome: string; comissaoValor: number;
  status: "aguardando" | "em_servico" | "concluido" | "entregue";
  statusPagamento: "pendente" | "pago"; formaPagamento: string | null;
  observacoes: string; entradaEm: string;
};
type Servico = { id: string; nome: string; preco: number; comissao: number; ativo: boolean };
type Funcionario = { id: string; nome: string; cargo: string; ativo: boolean };

const fmtMoeda = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtHora = (d: string) => new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

const statusCfg = {
  aguardando: { label: "Aguardando", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  em_servico: { label: "Em Serviço", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  concluido: { label: "Concluído", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  entregue: { label: "Entregue", color: "#A0A0A0", bg: "rgba(160,160,160,0.08)" },
};
const pgCfg = {
  pendente: { label: "Pendente", color: "#f59e0b" },
  pago: { label: "Pago", color: "#22c55e" },
};

const inputS: React.CSSProperties = {
  background: "#1c1c1c", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14,
  width: "100%", boxSizing: "border-box", outline: "none",
};
const labelS: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#A0A0A0", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [detailOrdem, setDetailOrdem] = useState<Ordem | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nomeCliente: "", telefoneCliente: "", modeloVeiculo: "",
    placaVeiculo: "", corVeiculo: "", servicoId: "",
    funcionarioId: "", observacoes: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const [o, s, f] = await Promise.all([
      fetch("/api/ordens").then(r => r.json()),
      fetch("/api/servicos").then(r => r.json()),
      fetch("/api/funcionarios").then(r => r.json()),
    ]);
    setOrdens(o); setServicos(s); setFuncionarios(f);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const criarOrdem = async () => {
    if (!form.nomeCliente || !form.modeloVeiculo || !form.servicoId) return;
    setSaving(true);
    await fetch("/api/ordens", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false);
    setForm({ nomeCliente: "", telefoneCliente: "", modeloVeiculo: "", placaVeiculo: "", corVeiculo: "", servicoId: "", funcionarioId: "", observacoes: "" });
    await load();
    setSaving(false);
  };

  const atualizarStatus = async (id: string, status: string) => {
    await fetch(`/api/ordens/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setOrdens(prev => prev.map(o => o.id === id ? { ...o, status: status as Ordem["status"] } : o));
    if (detailOrdem?.id === id) setDetailOrdem(prev => prev ? { ...prev, status: status as Ordem["status"] } : null);
  };

  const atualizarPagamento = async (id: string, statusPagamento: string, formaPagamento: string) => {
    await fetch(`/api/ordens/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ statusPagamento, formaPagamento }) });
    setOrdens(prev => prev.map(o => o.id === id ? { ...o, statusPagamento: statusPagamento as Ordem["statusPagamento"], formaPagamento } : o));
    if (detailOrdem?.id === id) setDetailOrdem(prev => prev ? { ...prev, statusPagamento: statusPagamento as Ordem["statusPagamento"], formaPagamento } : null);
  };

  const servicoSelecionado = servicos.find(s => s.id === form.servicoId);

  const filtered = ordens.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.nomeCliente.toLowerCase().includes(q) || o.modeloVeiculo.toLowerCase().includes(q) || o.placaVeiculo.toLowerCase().includes(q) || o.servicoNome.toLowerCase().includes(q);
    const matchStatus = filterStatus === "todos" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Entrada de Veículos</h1>
          <p style={{ color: "#555", fontSize: 14 }}>{ordens.filter(o => o.status !== "entregue").length} veículo(s) ativos</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={load} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 14px", color: "#A0A0A0", cursor: "pointer" }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ fontSize: 14, padding: "10px 20px" }}>
            <Plus size={16} /> Registrar Entrada
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
          <input placeholder="Buscar por cliente, placa, modelo..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputS, paddingLeft: 36 }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["todos", "aguardando", "em_servico", "concluido", "entregue"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: filterStatus === s ? 600 : 400,
                border: `1px solid ${filterStatus === s ? "rgba(224,30,30,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: filterStatus === s ? "rgba(224,30,30,0.1)" : "transparent",
                color: filterStatus === s ? "#e01e1e" : "#A0A0A0",
              }}>
              {s === "todos" ? "Todos" : statusCfg[s as keyof typeof statusCfg]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Ordens list */}
      {loading ? (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>
          <Car size={48} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
          <p>Nenhuma ordem encontrada</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(o => {
            const st = statusCfg[o.status];
            const pg = pgCfg[o.statusPagamento];
            return (
              <div key={o.id} onClick={() => setDetailOrdem(o)}
                style={{
                  background: "#161616", border: `1px solid ${detailOrdem?.id === o.id ? "rgba(224,30,30,0.3)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 14, padding: "16px 20px", cursor: "pointer", transition: "all 150ms",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: "#e01e1e", minWidth: 40 }}>#{o.numero}</span>
                  <div style={{ background: st.bg, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: st.color }}>
                    {st.label}
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{o.modeloVeiculo} {o.corVeiculo ? `· ${o.corVeiculo}` : ""}</div>
                    <div style={{ color: "#555", fontSize: 12 }}>{o.nomeCliente} {o.placaVeiculo ? `· ${o.placaVeiculo}` : ""}</div>
                  </div>
                  <div style={{ color: "#A0A0A0", fontSize: 13, minWidth: 120 }}>{o.servicoNome}</div>
                  <div style={{ color: "#555", fontSize: 12, minWidth: 100 }}>{o.funcionarioNome || "—"}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#22c55e" }}>{fmtMoeda(o.servicoPreco)}</div>
                  <div style={{ background: pg.color + "22", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: pg.color }}>
                    {pg.label}
                  </div>
                  <div style={{ color: "#555", fontSize: 12 }}>{fmtHora(o.entradaEm)}</div>
                </div>

                {detailOrdem?.id === o.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                      <span style={{ fontSize: 12, color: "#555" }}>Tel: {o.telefoneCliente || "—"}</span>
                      {o.observacoes && <span style={{ fontSize: 12, color: "#555" }}>Obs: {o.observacoes}</span>}
                      <span style={{ fontSize: 12, color: "#555" }}>Comissão: {fmtMoeda(o.comissaoValor)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {o.status === "aguardando" && (
                        <button onClick={() => atualizarStatus(o.id, "em_servico")}
                          style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "rgba(59,130,246,0.15)", color: "#3b82f6", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          <Wrench size={12} style={{ marginRight: 4 }} />Iniciar Serviço
                        </button>
                      )}
                      {o.status === "em_servico" && (
                        <button onClick={() => atualizarStatus(o.id, "concluido")}
                          style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          <CheckCircle size={12} style={{ marginRight: 4 }} />Concluir
                        </button>
                      )}
                      {o.status === "concluido" && (
                        <button onClick={() => atualizarStatus(o.id, "entregue")}
                          style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "rgba(160,160,160,0.12)", color: "#A0A0A0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          Entregar
                        </button>
                      )}
                      {o.statusPagamento === "pendente" && (
                        <>
                          {["dinheiro", "pix", "credito", "debito"].map(fp => (
                            <button key={fp} onClick={() => atualizarPagamento(o.id, "pago", fp)}
                              style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.3)", background: "transparent", color: "#22c55e", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                              Pago ({fp})
                            </button>
                          ))}
                        </>
                      )}
                      {o.statusPagamento === "pago" && (
                        <span style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: 12, fontWeight: 700 }}>
                          ✓ Pago {o.formaPagamento ? `(${o.formaPagamento})` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nova Entrada */}
      {showModal && (
        <Modal title="Registrar Entrada de Veículo" onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelS}>Cliente *</label>
                <input placeholder="Nome do cliente" value={form.nomeCliente} onChange={e => setForm(f => ({ ...f, nomeCliente: e.target.value }))} style={inputS} />
              </div>
              <div>
                <label style={labelS}>Telefone</label>
                <input placeholder="(00) 00000-0000" value={form.telefoneCliente} onChange={e => setForm(f => ({ ...f, telefoneCliente: e.target.value }))} style={inputS} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelS}>Modelo do Veículo *</label>
                <input placeholder="Ex: Honda Civic" value={form.modeloVeiculo} onChange={e => setForm(f => ({ ...f, modeloVeiculo: e.target.value }))} style={inputS} />
              </div>
              <div>
                <label style={labelS}>Cor</label>
                <input placeholder="Ex: Branco" value={form.corVeiculo} onChange={e => setForm(f => ({ ...f, corVeiculo: e.target.value }))} style={inputS} />
              </div>
            </div>
            <div>
              <label style={labelS}>Placa</label>
              <input placeholder="ABC-1234" value={form.placaVeiculo} onChange={e => setForm(f => ({ ...f, placaVeiculo: e.target.value.toUpperCase() }))} style={inputS} maxLength={8} />
            </div>
            <div>
              <label style={labelS}>Serviço *</label>
              <select value={form.servicoId} onChange={e => setForm(f => ({ ...f, servicoId: e.target.value }))} style={inputS}>
                <option value="">Selecionar serviço...</option>
                {servicos.filter(s => s.ativo).map(s => (
                  <option key={s.id} value={s.id}>{s.nome} — {fmtMoeda(s.preco)}</option>
                ))}
              </select>
              {servicoSelecionado && (
                <div style={{ marginTop: 6, fontSize: 12, color: "#A0A0A0" }}>
                  Comissão: {fmtMoeda(servicoSelecionado.comissao)}
                </div>
              )}
            </div>
            <div>
              <label style={labelS}>Funcionário Responsável</label>
              <select value={form.funcionarioId} onChange={e => setForm(f => ({ ...f, funcionarioId: e.target.value }))} style={inputS}>
                <option value="">Selecionar funcionário...</option>
                {funcionarios.filter(f => f.ativo).map(f => (
                  <option key={f.id} value={f.id}>{f.nome} ({f.cargo})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelS}>Observações</label>
              <textarea placeholder="Alguma observação sobre o veículo..." value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                style={{ ...inputS, minHeight: 70, resize: "vertical" }} />
            </div>
            <button onClick={criarOrdem} disabled={saving || !form.nomeCliente || !form.modeloVeiculo || !form.servicoId}
              className="btn-primary" style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Registrando..." : "Registrar Entrada"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
