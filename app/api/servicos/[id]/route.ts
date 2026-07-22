import { NextResponse } from 'next/server'
import { db } from '@/db'
import { servicos } from '@/db/schemas/schema'
import { eq } from 'drizzle-orm'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const [row] = await db.update(servicos).set({
    nome: body.nome,
    descricao: body.descricao,
    preco: Math.round(parseFloat(body.preco) * 100),
    comissao: Math.round(parseFloat(body.comissao ?? 0) * 100),
    duracaoMin: parseInt(body.duracaoMin ?? 30),
    ativo: body.ativo,
  }).where(eq(servicos.id, id)).returning()
  return NextResponse.json(row)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.update(servicos).set({ ativo: false }).where(eq(servicos.id, id))
  return NextResponse.json({ success: true })
}
