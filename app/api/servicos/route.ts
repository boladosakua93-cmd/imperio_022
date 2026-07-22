import { NextResponse } from 'next/server'
import { db } from '@/db'
import { servicos } from '@/db/schemas/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const rows = await db.select().from(servicos).orderBy(servicos.nome)
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()
  const [row] = await db.insert(servicos).values({
    nome: body.nome,
    descricao: body.descricao ?? '',
    preco: Math.round(parseFloat(body.preco) * 100),
    comissao: Math.round(parseFloat(body.comissao ?? 0) * 100),
    duracaoMin: parseInt(body.duracaoMin ?? 30),
    ativo: true,
  }).returning()
  return NextResponse.json(row, { status: 201 })
}
