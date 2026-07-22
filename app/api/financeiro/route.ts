import { NextResponse } from 'next/server'
import { db } from '@/db'
import { ordens } from '@/db/schemas/schema'
import { gte, lte, and, eq, sql } from 'drizzle-orm'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const inicio = searchParams.get('inicio')
  const fim = searchParams.get('fim')

  const conditions = []
  if (inicio) conditions.push(gte(ordens.entradaEm, new Date(inicio)))
  if (fim) {
    const fimDate = new Date(fim)
    fimDate.setHours(23, 59, 59, 999)
    conditions.push(lte(ordens.entradaEm, fimDate))
  }

  const rows = await db.select().from(ordens)
    .where(conditions.length > 0 ? and(...conditions) : undefined)

  const totalServicos = rows.length
  const totalRecebido = rows.filter(r => r.statusPagamento === 'pago').reduce((s, r) => s + r.servicoPreco, 0)
  const totalPendente = rows.filter(r => r.statusPagamento === 'pendente').reduce((s, r) => s + r.servicoPreco, 0)
  const totalComissoes = rows.reduce((s, r) => s + r.comissaoValor, 0)
  const lucro = totalRecebido - totalComissoes

  // por funcionario
  const porFuncionario: Record<string, { nome: string; servicos: number; comissao: number }> = {}
  for (const r of rows) {
    if (!r.funcionarioNome) continue
    if (!porFuncionario[r.funcionarioNome]) {
      porFuncionario[r.funcionarioNome] = { nome: r.funcionarioNome, servicos: 0, comissao: 0 }
    }
    porFuncionario[r.funcionarioNome].servicos++
    porFuncionario[r.funcionarioNome].comissao += r.comissaoValor
  }

  // por servico
  const porServico: Record<string, { nome: string; qtd: number; total: number }> = {}
  for (const r of rows) {
    if (!porServico[r.servicoNome]) {
      porServico[r.servicoNome] = { nome: r.servicoNome, qtd: 0, total: 0 }
    }
    porServico[r.servicoNome].qtd++
    porServico[r.servicoNome].total += r.servicoPreco
  }

  return NextResponse.json({
    totalServicos,
    totalRecebido,
    totalPendente,
    totalComissoes,
    lucro,
    porFuncionario: Object.values(porFuncionario),
    porServico: Object.values(porServico),
  })
}
