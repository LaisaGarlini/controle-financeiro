import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    //quando for a rota raiz, redireciona para a rota /home
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/home', request.url))
    }
}
