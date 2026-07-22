import { NextResponse } from 'next/server'
import { db } from '@/db'
import { ordens } from '@/db/schemas/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const updateData: Record<string, unknown> = {}
  if (body.status !== undefined) updateData.status = body.status
  if (body.statusPagamento !== undefined) updateData.statusPagamento = body.statusPagamento
  if (body.formaPagamento !== undefined) updateData.formaPagamento = body.formaPagamento
  if (body.status === 'entregue') updateData.saidaEm = new Date()

  const [row] = await db.update(ordens).set(updateData).where(eq(ordens.id, id)).returning()
  return NextResponse.json(row)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.delete(ordens).where(eq(ordens.id, id))
  return NextResponse.json({ success: true })
}
