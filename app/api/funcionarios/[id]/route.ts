import { NextResponse } from 'next/server'
import { db } from '@/db'
import { funcionarios } from '@/db/schemas/schema'
import { eq } from 'drizzle-orm'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const [row] = await db.update(funcionarios).set({
    nome: body.nome,
    telefone: body.telefone,
    cargo: body.cargo,
    ativo: body.ativo,
  }).where(eq(funcionarios.id, id)).returning()
  return NextResponse.json(row)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.update(funcionarios).set({ ativo: false }).where(eq(funcionarios.id, id))
  return NextResponse.json({ success: true })
}
