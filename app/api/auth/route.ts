import { NextRequest, NextResponse } from 'next/server'

type UserRole = 'admin' | 'funcionario'

const USERS: { usuario: string; senha: string; role: UserRole; nome: string }[] = [
  { usuario: 'andrepita', senha: 'Neoqeav2020!', role: 'admin', nome: 'André Pita' },
  { usuario: 'miguel', senha: 'miguel123', role: 'funcionario', nome: 'Miguel' },
]

const SESSION_TOKEN = 'imperio022_session'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const user = USERS.find(u => u.usuario === body.usuario && u.senha === body.senha)

  if (user) {
    const payload = JSON.stringify({ role: user.role, nome: user.nome, usuario: user.usuario })
    const res = NextResponse.json({ success: true, role: user.role, nome: user.nome })
    res.cookies.set(SESSION_TOKEN, payload, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    })
    return res
  }

  return NextResponse.json({ success: false, error: 'Usuário ou senha incorretos' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete(SESSION_TOKEN)
  return res
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_TOKEN)
  if (!cookie) return NextResponse.json({ authenticated: false })
  try {
    const data = JSON.parse(cookie.value)
    return NextResponse.json({ authenticated: true, ...data })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
