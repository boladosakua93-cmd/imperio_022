import { NextResponse } from 'next/server'
import { db } from '@/db'
import { ordens, servicos, funcionarios } from '@/db/schemas/schema'
import { desc, eq, sql } from 'drizzle-orm'

export async function GET() {
  const rows = await db.select().from(ordens).orderBy(desc(ordens.entradaEm))
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()

  // get next order number
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(ordens)
  const numero = Number(count) + 1

  // look up servico and funcionario for denormalized fields
  let servicoNome = body.servicoNome ?? ''
  let servicoPreco = Math.round(parseFloat(body.servicoPreco ?? 0) * 100)
  let comissaoValor = Math.round(parseFloat(body.comissaoValor ?? 0) * 100)
  let funcionarioNome = body.funcionarioNome ?? ''

  if (body.servicoId) {
    const [s] = await db.select().from(servicos).where(eq(servicos.id, body.servicoId))
    if (s) {
      servicoNome = s.nome
      servicoPreco = s.preco
      comissaoValor = s.comissao
    }
  }
  if (body.funcionarioId) {
    const [f] = await db.select().from(funcionarios).where(eq(funcionarios.id, body.funcionarioId))
    if (f) funcionarioNome = f.nome
  }

  const [row] = await db.insert(ordens).values({
    numero,
    nomeCliente: body.nomeCliente,
    telefoneCliente: body.telefoneCliente ?? '',
    modeloVeiculo: body.modeloVeiculo,
    placaVeiculo: body.placaVeiculo ?? '',
    corVeiculo: body.corVeiculo ?? '',
    servicoId: body.servicoId ?? null,
    servicoNome,
    servicoPreco,
    funcionarioId: body.funcionarioId ?? null,
    funcionarioNome,
    comissaoValor,
    observacoes: body.observacoes ?? '',
    status: 'aguardando',
    statusPagamento: 'pendente',
  }).returning()

  return NextResponse.json(row, { status: 201 })
}
