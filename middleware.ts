import { NextRequest, NextResponse } from 'next/server'

const SESSION_TOKEN = 'imperio022_session'

// Admin-only routes (funcionario cannot access)
const ADMIN_ONLY = [
  '/sistema/servicos',
  '/sistema/funcionarios',
  '/sistema/financeiro',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/sistema') && !pathname.startsWith('/sistema/login')) {
    const cookie = req.cookies.get(SESSION_TOKEN)

    if (!cookie) {
      const loginUrl = new URL('/sistema/login', req.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const session = JSON.parse(cookie.value)

      // Funcionário trying to access admin-only pages → redirect to ordens
      if (session.role === 'funcionario') {
        const blocked = ADMIN_ONLY.some(p => pathname.startsWith(p))
        if (blocked || pathname === '/sistema/dashboard') {
          return NextResponse.redirect(new URL('/sistema/ordens', req.url))
        }
      }
    } catch {
      const loginUrl = new URL('/sistema/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/sistema/:path*'],
}
