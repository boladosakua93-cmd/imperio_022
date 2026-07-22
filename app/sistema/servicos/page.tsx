"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Wrench, Edit2, X, CheckCircle } from "lucide-react";

type Servico = { id: string; nome: string; descricao: string; preco: number; comissao: number; duracaoMin: number; ativo: boolean };

const fmtMoeda = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const inputS: React.CSSProperties = {
  background: "#1c1c1c", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14,
  width: "100%", boxSizing: "border-box", outline: "none",
};
const labelS: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#A0A0A0", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, width: "100%", maxWidth: 480 }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

const emptyForm = { nome: "", descricao: "", preco: "", comissao: "", duracaoMin: "30" };

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetch("/api/servicos").then(r => r.json());
    setServicos(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s: Servico) => {
    setEditing(s);
    setForm({ nome: s.nome, descricao: s.descricao, preco: (s.preco / 100).toFixed(2), comissao: (s.comissao / 100).toFixed(2), duracaoMin: String(s.duracaoMin) });
    setShowModal(true);
  };

  const save = async () => {
    setSaving(true);
    if (editing) {
      await fetch(`/api/servicos/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, ativo: editing.ativo }) });
    } else {
      await fetch("/api/servicos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    await load();
    setSaving(false);
  };

  const toggle = async (s: Servico) => {
    await fetch(`/api/servicos/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...s, preco: s.preco / 100, comissao: s.comissao / 100, ativo: !s.ativo }) });
    setServicos(prev => prev.map(x => x.id === s.id ? { ...x, ativo: !x.ativo } : x));
  };

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Serviços</h1>
          <p style={{ color: "#555", fontSize: 14 }}>{servicos.filter(s => s.ativo).length} serviço(s) ativo(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ fontSize: 14, padding: "10px 20px" }}>
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>Carregando...</div>
      ) : servicos.length === 0 ? (
        <div style={{ color: "#555", textAlign: "center", padding: 60 }}>
          <Wrench size={48} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
          <p>Nenhum serviço cadastrado</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {servicos.map(s => (
            <div key={s.id} style={{
              background: "#161616", border: `1px solid ${s.ativo ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)"}`,
              borderRadius: 16, padding: 22, opacity: s.ativo ? 1 : 0.5,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(224,30,30,0.1)", border: "1px solid rgba(224,30,30,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wrench size={20} color="#e01e1e" />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(s)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#A0A0A0", cursor: "pointer" }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => toggle(s)} style={{ background: s.ativo ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)", border: "none", borderRadius: 8, padding: "6px 10px", color: s.ativo ? "#ef4444" : "#22c55e", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    {s.ativo ? "Desativar" : "Ativar"}
                  </button>
                </div>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{s.nome}</h3>
              {s.descricao && <p style={{ color: "#555", fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>{s.descricao}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#22c55e" }}>{fmtMoeda(s.preco)}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>Comissão: {fmtMoeda(s.comissao)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: "#A0A0A0" }}>{s.duracaoMin} min</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Editar Serviço" : "Novo Serviço"} onClose={() => setShowModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelS}>Nome do Serviço *</label>
              <input placeholder="Ex: Lavagem Completa" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} style={inputS} />
            </div>
            <div>
              <label style={labelS}>Descrição</label>
              <textarea placeholder="Descreva o serviço..." value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                style={{ ...inputS, minHeight: 70, resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelS}>Preço (R$) *</label>
                <input type="number" step="0.01" placeholder="0.00" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} style={inputS} />
              </div>
              <div>
                <label style={labelS}>Comissão (R$)</label>
                <input type="number" step="0.01" placeholder="0.00" value={form.comissao} onChange={e => setForm(f => ({ ...f, comissao: e.target.value }))} style={inputS} />
              </div>
              <div>
                <label style={labelS}>Duração (min)</label>
                <input type="number" placeholder="30" value={form.duracaoMin} onChange={e => setForm(f => ({ ...f, duracaoMin: e.target.value }))} style={inputS} />
              </div>
            </div>
            <button onClick={save} disabled={saving || !form.nome || !form.preco} className="btn-primary"
              style={{ opacity: saving || !form.nome || !form.preco ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Salvando..." : editing ? "Salvar Alterações" : "Criar Serviço"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
