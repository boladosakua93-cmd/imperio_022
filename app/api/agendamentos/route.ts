import { NextRequest, NextResponse } from "next/server";

// In-memory store (works without DB setup)
type Agendamento = {
  id: string;
  servico: string;
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

// Use global to persist across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __agendamentos: Agendamento[] | undefined;
}

function getStore(): Agendamento[] {
  if (!global.__agendamentos) {
    global.__agendamentos = [
      {
        id: "1",
        servico: "lavagem-completa",
        servicoNome: "Lavagem Completa",
        servicoPreco: 60,
        data: new Date().toISOString().split("T")[0],
        horario: "09:00",
        nomeCliente: "João Silva",
        telefone: "(11) 99999-1111",
        tipoVeiculo: "Sedan",
        placa: "ABC-1234",
        modelo: "Toyota Corolla",
        observacoes: "",
        status: "confirmado",
        criadoEm: new Date().toISOString(),
      },
      {
        id: "2",
        servico: "polimento",
        servicoNome: "Polimento",
        servicoPreco: 150,
        data: new Date().toISOString().split("T")[0],
        horario: "14:00",
        nomeCliente: "Maria Santos",
        telefone: "(11) 98888-2222",
        tipoVeiculo: "SUV",
        placa: "DEF-5678",
        modelo: "Honda HRV",
        observacoes: "Tem um risco no capô",
        status: "pendente",
        criadoEm: new Date().toISOString(),
      },
      {
        id: "3",
        servico: "pacote-vip",
        servicoNome: "Pacote VIP",
        servicoPreco: 420,
        data: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        horario: "10:00",
        nomeCliente: "Pedro Costa",
        telefone: "(11) 97777-3333",
        tipoVeiculo: "Pickup",
        placa: "GHI-9012",
        modelo: "Ford Ranger",
        observacoes: "Tratar com cuidado os bancos de couro",
        status: "pendente",
        criadoEm: new Date().toISOString(),
      },
    ];
  }
  return global.__agendamentos;
}

export async function GET() {
  const store = getStore();
  return NextResponse.json({ agendamentos: store });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const store = getStore();

  const novo: Agendamento = {
    id: Date.now().toString(),
    servico: body.servico || "",
    servicoNome: body.servicoNome || "",
    servicoPreco: body.servicoPreco || 0,
    data: body.data || "",
    horario: body.horario || "",
    nomeCliente: body.nomeCliente || "",
    telefone: body.telefone || "",
    tipoVeiculo: body.tipoVeiculo || "",
    placa: body.placa || "",
    modelo: body.modelo || "",
    observacoes: body.observacoes || "",
    status: "pendente",
    criadoEm: new Date().toISOString(),
  };

  store.push(novo);
  return NextResponse.json({ success: true, agendamento: novo }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const store = getStore();
  const idx = store.findIndex(a => a.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  store[idx] = { ...store[idx], ...body };
  return NextResponse.json({ success: true, agendamento: store[idx] });
}
