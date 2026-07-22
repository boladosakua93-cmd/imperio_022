import { NextResponse } from 'next/server'
import { db } from '@/db'
import { funcionarios } from '@/db/schemas/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const rows = await db.select().from(funcionarios).orderBy(funcionarios.nome)
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()
  const [row] = await db.insert(funcionarios).values({
    nome: body.nome,
    telefone: body.telefone ?? '',
    cargo: body.cargo ?? 'Lavador',
    ativo: true,
  }).returning()
  return NextResponse.json(row, { status: 201 })
}
