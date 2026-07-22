import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db/index";
import { ordens, servicos } from "../../../db/schemas/schema";
import { eq, sql, like } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data");

    if (data) {
      // Buscar apenas horários ocupados para a data específica
      // O SQLite no D1 usa || para concatenação de strings
      const searchPattern = `%Agendado via Site para: ${data}%`;
      const ocupados = await db.select({
        observacoes: ordens.observacoes
      })
      .from(ordens)
      .where(like(ordens.observacoes, searchPattern));

      // Extrair o horário das observações: "Agendado via Site para: YYYY-MM-DD às HH:MM"
      const horarios = ocupados.map((o: { observacoes: string | null }) => {
        const match = o.observacoes?.match(/às (\d{2}:\d{2})/);
        return match ? match[1] : null;
      }).filter((h: string | null) => h !== null);

      return NextResponse.json({ 
        horariosOcupados: horarios 
      });
    }

    const allOrdens = await db.select().from(ordens);
    return NextResponse.json({ agendamentos: allOrdens });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    interface AgendamentoBody {
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
      taxaReserva: number;
      funcionarioNome: string;
      funcionarioId: string;
    }
    const body: AgendamentoBody = await req.json();

    // Buscar próximo número de ordem
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(ordens);
    const numero = Number(count) + 1;

    // Buscar informações do serviço
    // O formulário público envia 'moto', 'hatch', 'sedan', 'suv' ou o nome do serviço
    let servicoNome = body.servicoNome || body.servico || "";
    let servicoPreco = Math.round(parseFloat(String(body.servicoPreco || 0)) * 100);
    let comissaoValor = 0;
    let servicoIdEncontrado = null;

    // Tentar encontrar o serviço no banco pelo nome (case insensitive)
    if (servicoNome) {
      const [s] = await db.select().from(servicos).where(like(servicos.nome, `%${servicoNome}%`));
      if (s) {
        servicoIdEncontrado = s.id;
        servicoNome = s.nome;
        servicoPreco = s.preco;
        comissaoValor = s.comissao;
      }
    }

    // Criar a ordem no banco de dados
    const [novaOrdem] = await db.insert(ordens).values({
      numero,
      nomeCliente: body.nomeCliente || "Cliente Agendamento",
      telefoneCliente: body.telefone || "",
      modeloVeiculo: body.modelo || "Não informado",
      placaVeiculo: body.placa || "",
      corVeiculo: "", 
      servicoId: servicoIdEncontrado, // Usa o ID real do banco se encontrou, ou null para evitar erro de FK
      servicoNome: servicoNome,
      servicoPreco: servicoPreco,
      status: "aguardando",
      statusPagamento: "pendente",
      observacoes: `Agendado via Site para: ${body.data} às ${body.horario}. Obs: ${body.observacoes || "Nenhuma"}`,
      comissaoValor: comissaoValor,
      funcionarioNome: body.funcionarioNome,
      funcionarioId: body.funcionarioId,
    }).returning();

    return NextResponse.json({ success: true, agendamento: novaOrdem }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro ao processar agendamento" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    interface PatchBody {
      id: string;
      status?: "pendente" | "confirmado" | "concluido" | "cancelado";
      // Adicione outras propriedades que podem ser atualizadas aqui
    }
    const body: PatchBody = await req.json();
    if (!body.id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

    const [updated] = await db.update(ordens)
      .set({ ...body })
      .where(eq(ordens.id, body.id))
      .returning();

    if (!updated) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ success: true, agendamento: updated });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
