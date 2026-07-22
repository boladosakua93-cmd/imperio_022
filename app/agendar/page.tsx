"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Car, User, Phone, CheckCircle, ChevronRight,
  Copy, AlertTriangle,
} from "lucide-react";

const TAXA_RESERVA = 10;
const PIX_CHAVE = "21978670637"; // chave pix (telefone)

const services = [
  { id: "moto",      name: "Moto",   price: 35,  duration: "30 min", icon: Car },
  { id: "hatch",     name: "Hatch",  price: 60,  duration: "45 min", icon: Car },
  { id: "sedan",     name: "Sedan",  price: 70,  duration: "50 min", icon: Car },
  { id: "suv",       name: "SUV",    price: 100, duration: "60 min", icon: Car },
];

const timeSlots = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
];

const vehicleTypes = ["Hatch","Sedan","SUV","Pickup","Van/Minivan","Moto"];

const STEPS = ["Serviço","Data & Hora","Seus Dados","Pagamento"];

function AgendarContent() {
  const searchParams = useSearchParams();
  const servicoParam = searchParams.get("servico");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    servico: servicoParam || "",
    data: "", horario: "",
    nomeCliente: "", telefone: "",
    tipoVeiculo: "", placa: "", modelo: "", observacoes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (servicoParam) {
      const match = services.find(s => s.name === servicoParam);
      if (match) setForm(f => ({ ...f, servico: match.id }));
    }
  }, [servicoParam]);

  const selectedService = services.find(s => s.id === form.servico);
  const valorRestante = selectedService ? selectedService.price - TAXA_RESERVA : 0;

  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const validate = (s: number) => {
    const errs: Record<string, string> = {};
    if (s === 1 && !form.servico) errs.servico = "Selecione um serviço.";
    if (s === 2) {
      if (!form.data) errs.data = "Informe a data.";
      if (!form.horario) errs.horario = "Selecione um horário.";
    }
    if (s === 3) {
      if (!form.nomeCliente.trim()) errs.nomeCliente = "Informe seu nome.";
      if (!form.telefone.trim()) errs.telefone = "Informe seu telefone.";
      if (!form.tipoVeiculo) errs.tipoVeiculo = "Selecione o tipo do veículo.";
      if (!form.modelo.trim()) errs.modelo = "Informe o modelo.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validate(step)) setStep(s => s + 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          servicoNome: selectedService?.name,
          servicoPreco: selectedService?.price,
          taxaReserva: TAXA_RESERVA,
        }),
      });
      if (res.ok) setSuccess(true);
      else alert("Erro ao agendar. Tente novamente.");
    } catch {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_CHAVE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── TELA DE SUCESSO ──────────────────────────────────────────
  if (success) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Inter, sans-serif" }}>
        <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={40} color="#22c55e" />
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", marginBottom: 10 }}>
            Reserva <span className="gradient-text">Confirmada!</span>
          </h2>
          <p style={{ color: "#A0A0A0", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Recebemos seu agendamento. Apresente-se no horário marcado e o restante do serviço será cobrado com o desconto da taxa já paga.
          </p>

          {/* Resumo */}
          <div className="card-glow" style={{ padding: 22, marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e01e1e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>Resumo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Serviço",      value: selectedService?.name ?? "" },
                { label: "Data",         value: new Date(form.data + "T12:00:00").toLocaleDateString("pt-BR") },
                { label: "Horário",      value: form.horario },
                { label: "Veículo",      value: `${form.modelo} (${form.tipoVeiculo})` },
                { label: "Taxa paga (Pix)", value: `R$ ${TAXA_RESERVA},00`, highlight: true },
                { label: "Restante no dia", value: `R$ ${valorRestante},00`, highlight: true },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#555", fontSize: 14 }}>{row.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: row.highlight ? "#22c55e" : "#fff" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left" }}>
            <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: "#f59e0b", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              <strong>Atenção:</strong> caso não compareça, a taxa de R$ 10,00 não será devolvida. O horário ficará disponível novamente.
            </p>
          </div>

          <Link href="/" className="btn-primary" style={{ justifyContent: "center", width: "100%", boxSizing: "border-box" }}>
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  // ── ESTILOS ──────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: "var(--card)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 15,
    width: "100%", outline: "none", transition: "border-color 150ms", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: "#A0A0A0", marginBottom: 6,
    display: "block", textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", fontFamily: "Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/" style={{ color: "#A0A0A0", display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 14, fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}>
          <ArrowLeft size={16} /> Voltar
        </Link>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Image src="/logo.png" alt="Império 022" width={80} height={44} style={{ objectFit: "contain" }} />
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Progress */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ textAlign: "center", flex: 1 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: i + 1 < step ? "var(--gradient-brand)" : i + 1 === step ? "rgba(224,30,30,0.2)" : "rgba(255,255,255,0.05)",
                  border: i + 1 <= step ? "2px solid rgba(224,30,30,0.8)" : "2px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 6px", fontSize: 12, fontWeight: 700,
                  color: i + 1 < step ? "#fff" : i + 1 === step ? "#e01e1e" : "#555",
                }}>
                  {i + 1 < step ? <CheckCircle size={13} /> : i + 1}
                </div>
                <div style={{ fontSize: 11, color: i + 1 === step ? "#e01e1e" : "#555", fontWeight: i + 1 === step ? 600 : 400 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${((step - 1) / 3) * 100}%`, background: "var(--gradient-brand)", borderRadius: 2, transition: "width 400ms ease" }} />
          </div>
        </div>

        {/* STEP 1 — Serviço */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>Escolha o serviço</h2>
            <p style={{ color: "#A0A0A0", marginBottom: 28, fontSize: 14 }}>Selecione qual serviço deseja agendar</p>
            {errors.servico && <div style={{ color: "#ff4444", fontSize: 13, marginBottom: 14 }}>{errors.servico}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {services.map(s => {
                const Icon = s.icon;
                const sel = form.servico === s.id;
                return (
                  <button key={s.id} onClick={() => setForm(f => ({ ...f, servico: s.id }))}
                    style={{ background: sel ? "rgba(224,30,30,0.08)" : "var(--card)", border: `1px solid ${sel ? "rgba(224,30,30,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 200ms" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: sel ? "rgba(224,30,30,0.15)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={19} color={sel ? "#e01e1e" : "#666"} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: sel ? "#fff" : "#ccc" }}>{s.name}</div>
                      <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{s.duration}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#777", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>A partir de</div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: sel ? "#e01e1e" : "#A0A0A0" }}>R$ {s.price},00</div>
                      <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>+ taxa R$ {TAXA_RESERVA}</div>
                    </div>
                    {sel && <CheckCircle size={17} color="#e01e1e" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 — Data e Hora */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>Data e Horário</h2>
            <p style={{ color: "#A0A0A0", marginBottom: 28, fontSize: 14 }}>Quando deseja trazer seu veículo?</p>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Data</label>
              <input type="date" value={form.data} min={getTodayStr()}
                onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                style={{ ...inputStyle, colorScheme: "dark", borderColor: errors.data ? "#ff4444" : undefined }} />
              {errors.data && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 6 }}>{errors.data}</div>}
            </div>
            <div>
              <label style={labelStyle}>Horário disponível</label>
              {errors.horario && <div style={{ color: "#ff4444", fontSize: 12, marginBottom: 8 }}>{errors.horario}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {timeSlots.map(t => {
                  const sel = form.horario === t;
                  return (
                    <button key={t} onClick={() => setForm(f => ({ ...f, horario: t }))}
                      style={{ padding: "12px 8px", borderRadius: 10, border: `1px solid ${sel ? "rgba(224,30,30,0.6)" : "rgba(255,255,255,0.08)"}`, background: sel ? "rgba(224,30,30,0.1)" : "var(--card)", color: sel ? "#e01e1e" : "#A0A0A0", fontSize: 14, fontWeight: sel ? 700 : 400, cursor: "pointer", transition: "all 150ms" }}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Dados do cliente */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>Seus dados</h2>
            <p style={{ color: "#A0A0A0", marginBottom: 28, fontSize: 14 }}>Preencha seus dados para finalizar</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}><User size={11} style={{ display: "inline", marginRight: 4 }} />Nome *</label>
                  <input placeholder="Nome completo" value={form.nomeCliente} onChange={e => setForm(f => ({ ...f, nomeCliente: e.target.value }))} style={{ ...inputStyle, borderColor: errors.nomeCliente ? "#ff4444" : undefined }} />
                  {errors.nomeCliente && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 4 }}>{errors.nomeCliente}</div>}
                </div>
                <div>
                  <label style={labelStyle}><Phone size={11} style={{ display: "inline", marginRight: 4 }} />Telefone *</label>
                  <input placeholder="(00) 00000-0000" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} style={{ ...inputStyle, borderColor: errors.telefone ? "#ff4444" : undefined }} />
                  {errors.telefone && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 4 }}>{errors.telefone}</div>}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}><Car size={11} style={{ display: "inline", marginRight: 4 }} />Tipo *</label>
                  <select value={form.tipoVeiculo} onChange={e => setForm(f => ({ ...f, tipoVeiculo: e.target.value }))} style={{ ...inputStyle, borderColor: errors.tipoVeiculo ? "#ff4444" : undefined }}>
                    <option value="">Selecione...</option>
                    {vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  {errors.tipoVeiculo && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 4 }}>{errors.tipoVeiculo}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Modelo *</label>
                  <input placeholder="Ex: Honda Civic" value={form.modelo} onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))} style={{ ...inputStyle, borderColor: errors.modelo ? "#ff4444" : undefined }} />
                  {errors.modelo && <div style={{ color: "#ff4444", fontSize: 12, marginTop: 4 }}>{errors.modelo}</div>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Placa (opcional)</label>
                <input placeholder="ABC-1234" value={form.placa} onChange={e => setForm(f => ({ ...f, placa: e.target.value.toUpperCase() }))} style={inputStyle} maxLength={8} />
              </div>
              <div>
                <label style={labelStyle}>Observações (opcional)</label>
                <textarea placeholder="Alguma informação sobre o veículo..." value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
              </div>
            </div>

            {/* Resumo */}
            {selectedService && (
              <div className="card-glow" style={{ marginTop: 24, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#e01e1e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Resumo</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Serviço", value: selectedService.name },
                    { label: "Data", value: form.data ? new Date(form.data + "T12:00:00").toLocaleDateString("pt-BR") : "—" },
                    { label: "Horário", value: form.horario || "—" },
                    { label: "Total do serviço", value: `R$ ${selectedService.price},00` },
                    { label: "Taxa de reserva (Pix)", value: `R$ ${TAXA_RESERVA},00`, color: "#f59e0b" },
                    { label: "Restante no dia", value: `R$ ${valorRestante},00`, color: "#22c55e" },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#555", fontSize: 13 }}>{row.label}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: row.color ?? "#fff" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Pagamento Pix */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>Taxa de Reserva</h2>
            <p style={{ color: "#A0A0A0", marginBottom: 24, fontSize: 14, lineHeight: 1.7 }}>
              Para garantir seu horário, pague a taxa de <strong style={{ color: "#fff" }}>R$ {TAXA_RESERVA},00 via Pix</strong>. Esse valor é descontado do serviço quando você comparecer.
            </p>

            {/* Aviso */}
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: "#f59e0b", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Caso não compareça, a taxa de R$ {TAXA_RESERVA},00 <strong>não será devolvida</strong>.
              </p>
            </div>

            {/* Card de valor */}
            <div style={{ background: "rgba(224,30,30,0.06)", border: "1px solid rgba(224,30,30,0.25)", borderRadius: 14, padding: "18px 20px", marginBottom: 24, textAlign: "center" }}>
              <div style={{ color: "#A0A0A0", fontSize: 13, marginBottom: 4 }}>Valor a pagar agora</div>
              <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2px", color: "#e01e1e" }}>R$ 10,00</div>
              <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>Taxa de reserva de horário</div>
            </div>

            {/* QR Code */}
            <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e01e1e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
                Escaneie o QR Code Pix
              </div>
              <Image
                src="/qrcode-pix.png"
                alt="QR Code Pix Império 022"
                width={280}
                height={373}
                style={{ width: "100%", maxWidth: 260, height: "auto", borderRadius: 12, margin: "0 auto" }}
              />
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#555", fontSize: 12, marginBottom: 4 }}>Favorecido</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Andre Luiz Castro Coelho</div>
                <div style={{ color: "#A0A0A0", fontSize: 13 }}>Banco Neon</div>
              </div>
            </div>

            {/* Chave Pix */}
            <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
              <div style={{ color: "#555", fontSize: 12, marginBottom: 6 }}>Ou use a chave Pix (telefone)</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.5px" }}>{PIX_CHAVE}</div>
                <button onClick={copyPix} style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "7px 14px", color: copied ? "#22c55e" : "#A0A0A0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 200ms" }}>
                  {copied ? <><CheckCircle size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>
            </div>

            {/* Resumo final */}
            {selectedService && (
              <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>No dia do serviço você paga</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#A0A0A0", fontSize: 14 }}>{selectedService.name} — R$ {selectedService.price} – R$ {TAXA_RESERVA}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>R$ {valorRestante},00</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navegação */}
        <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "space-between" }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-outline" style={{ padding: "12px 22px" }}>
              <ArrowLeft size={16} /> Voltar
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={nextStep} className="btn-primary">
              Continuar <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Confirmando..." : <><CheckCircle size={18} /> Já paguei, confirmar</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#A0A0A0" }}>Carregando...</div>
      </div>
    }>
      <AgendarContent />
    </Suspense>
  );
}
