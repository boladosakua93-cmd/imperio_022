"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Users, Edit2, X, Phone } from "lucide-react";

type Funcionario = { id: string; nome: string; telefone: string; cargo: string; ativo: boolean; criadoEm: string };

const inputS: React.CSSProperties = {
  background: "#1c1c1c", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14,
  width: "100%", boxSizing: "border-box", outline: "none",
};
const labelS: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#A0A0A0", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, width: "100%", maxWidth: 420 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

const emptyForm = { nome: "", telefone: "", cargo: "Lavador" };
const cargos = ["Lavador", "Polidor", "Gerente", "Caixa", "Auxiliar"];

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Funcionario | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetch("/api/funcionarios").then(r => r.json());
    setFuncionarios(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (f: Funcionario) => {
    setEditing(f);
    setForm({ nome: f.nome, telefone: f.telefone, cargo: f.cargo });
    setShowModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (editing) {
      await fetch(`/api/funcionarios/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, ativo: editing.ativo }) });
    } else {
      await fetch("/api/funcionarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    await load();
    setSaving(false);
  };

  const toggle = async (f: Funcionario) => {
    await fetch(`/api/funcionarios/${f.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, ativo: !f.ativo }) });
    setFuncionarios(prev => prev.map(x => x.id === f.id ? { ...x, ativo: !x.ativo } : x));
  };

  const ativos = funcionarios.filter(f => f.ativo);
  const inativos = funcionarios.filter(f => !f.ativo);

  const initials = (nome: string) => nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["#e01e1e", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];
  const getColor = (nome: string) => colors[nome.charCodeAt(0) % colors.length];

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Funcionários</h1>
          <p style={{ color: "#555", fontSize: 14 }}>{ativos.length} funcionário(s) ativo(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ fontSize: 14, padding: "10px 20px" }}>
          <Plus size={16} /> Cadastrar Funcionário
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>Carregando...</div>
      ) : funcionarios.length === 0 ? (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>
          <Users size={48} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
          <p>Nenhum funcionário cadastrado</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: inativos.length > 0 ? 32 : 0 }}>
            {ativos.map(f => {
              const c = getColor(f.nome);
              return (
                <div key={f.id} style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: `${c}22`, border: `2px solid ${c}66`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 17, fontWeight: 800, color: c,
                    }}>
                      {initials(f.nome)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{f.nome}</div>
                      <div style={{ fontSize: 12, color: "#555", background: "rgba(255,255,255,0.06)", borderRadius: 100, padding: "2px 10px", display: "inline-block", marginTop: 4 }}>{f.cargo}</div>
                    </div>
                  </div>
                  {f.telefone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#A0A0A0", fontSize: 13, marginBottom: 16 }}>
                      <Phone size={13} /> {f.telefone}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(f)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#A0A0A0", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <Edit2 size={13} /> Editar
                    </button>
                    <button onClick={() => toggle(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>
                      Desativar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {inativos.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#555", marginBottom: 16, textTransform: "uppercase", letterSpacing: "1px" }}>Inativos</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {inativos.map(f => (
                  <div key={f.id} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: 18, opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#555", fontSize: 14 }}>{f.nome}</span>
                    <button onClick={() => toggle(f)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.3)", background: "transparent", color: "#22c55e", cursor: "pointer", fontSize: 12 }}>
                      Reativar
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {showModal && (
        <Modal title={editing ? "Editar Funcionário" : "Cadastrar Funcionário"} onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelS}>Nome Completo *</label>
              <input placeholder="Nome do funcionário" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Telefone</label>
              <input placeholder="(00) 00000-0000" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Cargo</label>
              <select value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} style={inputS}>
                {cargos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={save} disabled={saving || !form.nome} className="btn-primary"
              style={{ opacity: saving || !form.nome ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Salvando..." : editing ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
