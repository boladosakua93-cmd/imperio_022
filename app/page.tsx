"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Clock,
  Star,
  MapPin,
  Phone,
  Instagram,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Moto",
    description: "Lavagem completa para motos de todos os modelos, com atenção aos detalhes.",
    price: "a partir de R$ 35",
    badge: null,
  },
  {
    icon: Car,
    title: "Hatch",
    description: "Lavagem interna e externa para carros de passeio tipo hatch.",
    price: "a partir de R$ 60",
    badge: "Popular",
  },
  {
    icon: Car,
    title: "Sedan",
    description: "Serviço completo para sedans com tratamento especial no acabamento.",
    price: "a partir de R$ 70",
    badge: null,
  },
  {
    icon: Car,
    title: "SUV",
    description: "Lavagem premium para SUVs e veículos de grande porte.",
    price: "a partir de R$ 100",
    badge: "Premium",
  },
];

const testimonials = [
  {
    name: "Carlos M.",
    vehicle: "Toyota Corolla",
    text: "Melhor lava jato que já fui! Meu carro saiu impecável, parecia novo. Super recomendo!",
    rating: 5,
  },
  {
    name: "Ana S.",
    vehicle: "Honda HRV",
    text: "Atendimento excelente, pessoal muito dedicado. Voltarei sempre que precisar.",
    rating: 5,
  },
  {
    name: "Pedro R.",
    vehicle: "Ford Ranger",
    text: "Fiz o pacote VIP e fiquei impressionado com o resultado. Brilho incrível!",
    rating: 5,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "var(--background)", color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          height: "68px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Image src="/logo.png" alt="Império 022" width={110} height={60} style={{ objectFit: "contain" }} priority />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <a href="#servicos" style={{ color: "#A0A0A0", fontSize: 14, fontWeight: 500, padding: "8px 14px", textDecoration: "none", borderRadius: 8, transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}>
              Serviços
            </a>
            <a href="#sobre" style={{ color: "#A0A0A0", fontSize: 14, fontWeight: 500, padding: "8px 14px", textDecoration: "none", borderRadius: 8, transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}>
              Sobre
            </a>
            <a href="#depoimentos" style={{ color: "#A0A0A0", fontSize: 14, fontWeight: 500, padding: "8px 14px", textDecoration: "none", borderRadius: 8, transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}>
              Depoimentos
            </a>
            <Link href="/agendar" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>
              Agendar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: 68,
        }}
      >
        {/* Background pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(224,30,30,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(224,30,30,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(224,30,30,0.1)", border: "1px solid rgba(224,30,30,0.3)",
              borderRadius: 100, padding: "6px 16px", marginBottom: 32,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e01e1e", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#e01e1e", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Agendamento Online Disponível
              </span>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Image src="/logo.png" alt="Império 022" width={220} height={120} style={{ objectFit: "contain", margin: "0 auto 32px" }} />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h1 style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              marginBottom: 24,
            }}>
              Seu carro merece o{" "}
              <span className="gradient-text">melhor</span>
              <br />
              tratamento
            </h1>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#A0A0A0", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
              Lavagem premium, polimento, cristalização e muito mais. <br />
              <strong style={{ color: "#fff" }}>Brilho, Respeito e Presença</strong> — o Império 022 cuida do seu patrimônio.
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "400ms", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/agendar" className="btn-primary" style={{ fontSize: 16 }}>
              Agendar Agora <ChevronRight size={18} />
            </Link>
            <a href="#servicos" className="btn-outline" style={{ fontSize: 16 }}>
              Ver Serviços
            </a>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "500ms", marginTop: 80 }}>
            <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { value: "500+", label: "Clientes atendidos" },
                { value: "5★", label: "Avaliação média" },
                { value: "6", label: "Anos de experiência" },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }} className="gradient-text">{stat.value}</div>
                  <div style={{ color: "#A0A0A0", fontSize: 13, fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#e01e1e", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>
            Nossos Serviços
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            Cuidado completo para{" "}
            <span className="gradient-text">seu veículo</span>
          </h2>
          <p style={{ color: "#A0A0A0", fontSize: 18, maxWidth: 480, margin: "0 auto" }}>
            Do básico ao premium, oferecemos toda a gama de serviços para seu carro brilhar.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="card-glow" style={{ padding: 28, position: "relative" }}>
                {service.badge && (
                  <div style={{
                    position: "absolute", top: 20, right: 20,
                    background: service.badge === "Premium" || service.badge === "Completo"
                      ? "var(--gradient-brand)" : "rgba(224,30,30,0.15)",
                    color: service.badge === "Premium" || service.badge === "Completo" ? "#fff" : "#e01e1e",
                    border: service.badge === "Premium" || service.badge === "Completo" ? "none" : "1px solid rgba(224,30,30,0.3)",
                    borderRadius: 100,
                    padding: "3px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}>
                    {service.badge}
                  </div>
                )}
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "rgba(224,30,30,0.1)",
                  border: "1px solid rgba(224,30,30,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <Icon size={22} color="#e01e1e" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{service.title}</h3>
                <p style={{ color: "#A0A0A0", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{service.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }} className="gradient-text">{service.price}</span>
                  <Link href={`/agendar?servico=${encodeURIComponent(service.title)}`}
                    style={{
                      color: "#e01e1e", fontSize: 13, fontWeight: 600, textDecoration: "none",
                      display: "flex", alignItems: "center", gap: 4,
                      border: "1px solid rgba(224,30,30,0.3)", borderRadius: 100,
                      padding: "6px 14px",
                      transition: "all 150ms ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(224,30,30,0.1)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    Agendar <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre" style={{ background: "#111111", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ color: "#e01e1e", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>
              Sobre Nós
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 20 }}>
              Tradição e qualidade <br />
              <span className="gradient-text">desde 2018</span>
            </h2>
            <p style={{ color: "#A0A0A0", fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
              O Império 022 nasceu da paixão por carros e pelo cuidado que eles merecem. Com mais de 6 anos de experiência, nossa equipe é especializada em trazer o melhor resultado para cada tipo de veículo.
            </p>
            <p style={{ color: "#A0A0A0", fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Usamos produtos premium e técnicas modernas para garantir que seu carro saia impecável, sempre com atenção aos detalhes.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Produtos de alta qualidade", "Equipe treinada e experiente", "Atendimento personalizado", "Satisfação garantida"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle size={18} color="#e01e1e" />
                  <span style={{ color: "#ccc", fontSize: 15 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: Clock, title: "Horário", desc: "Seg–Sáb: 8h–18h\nDom: 8h–13h" },
              { icon: MapPin, title: "Localização", desc: "Atendimento local\nAgende e confirme o endereço" },
              { icon: Star, title: "Avaliação", desc: "5 estrelas\nMais de 500 reviews" },
              { icon: Phone, title: "Contato", desc: "WhatsApp disponível\nResposta rápida" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-glow" style={{ padding: 24 }}>
                  <Icon size={24} color="#e01e1e" style={{ marginBottom: 12 }} />
                  <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</h4>
                  <p style={{ color: "#A0A0A0", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="depoimentos" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#e01e1e", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>
            Depoimentos
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px" }}>
            O que nossos clientes{" "}
            <span className="gradient-text">dizem</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {testimonials.map(t => (
            <div key={t.name} className="card-glow" style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#e01e1e" color="#e01e1e" />
                ))}
              </div>
              <p style={{ color: "#ccc", fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                <div style={{ color: "#555", fontSize: 13, marginTop: 2 }}>{t.vehicle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: "linear-gradient(135deg, rgba(224,30,30,0.08) 0%, rgba(255,102,0,0.05) 100%)",
        border: "1px solid rgba(224,30,30,0.15)",
        borderRadius: 24,
        margin: "0 24px 100px",
        padding: "80px 24px",
        textAlign: "center",
        maxWidth: 1052,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
          Pronto para dar <span className="gradient-text">brilho</span> ao seu carro?
        </h2>
        <p style={{ color: "#A0A0A0", fontSize: 18, maxWidth: 480, margin: "0 auto 40px" }}>
          Agende agora mesmo e garanta seu horário. Rápido, fácil e sem complicações.
        </p>
        <Link href="/agendar" className="btn-primary" style={{ fontSize: 17 }}>
          Agendar Meu Horário <ChevronRight size={20} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "48px 24px",
        background: "#0a0a0a",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Image src="/logo.png" alt="Império 022" width={100} height={55} style={{ objectFit: "contain", marginBottom: 12 }} />
            <p style={{ color: "#555", fontSize: 13, maxWidth: 220, lineHeight: 1.7 }}>
              Brilho, Respeito e Presença.<br />O melhor lava jato da região.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Serviços</div>
              {["Lavagem Simples", "Lavagem Completa", "Polimento", "Cristalização"].map(s => (
                <div key={s} style={{ color: "#555", fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Links</div>
              <Link href="/agendar" style={{ display: "block", color: "#555", fontSize: 13, marginBottom: 8, textDecoration: "none" }}>Agendar</Link>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Contato</div>
              <a href="https://wa.me/5521978670637" target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, color: "#A0A0A0", fontSize: 13, textDecoration: "none", marginBottom: 10 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}
              >
                <Phone size={14} /> (21) 97867-0637
              </a>
              <a href="https://instagram.com/imperio_022" target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, color: "#A0A0A0", fontSize: 13, textDecoration: "none", marginBottom: 16 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A0A0A0")}
              >
                <Instagram size={14} /> @imperio_022
              </a>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://instagram.com/imperio_022" target="_blank" rel="noreferrer"
                  style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(224,30,30,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                >
                  <Instagram size={16} color="#A0A0A0" />
                </a>
                <a href="https://wa.me/5521978670637" target="_blank" rel="noreferrer"
                  style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(224,30,30,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                >
                  <Phone size={16} color="#A0A0A0" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "32px auto 0", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#555", fontSize: 12 }}>© 2026 Império 022. Todos os direitos reservados.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#555", fontSize: 12 }}>CNPJ: 26.456.713/0001-58</span>
            <Link href="/sistema/login"
              title="Área restrita"
              style={{
                color: "#333",
                fontSize: 11,
                textDecoration: "none",
                fontWeight: 500,
                letterSpacing: "0.3px",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#666")}
              onMouseLeave={e => (e.currentTarget.style.color = "#333")}
            >
              Acesso Empresa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
