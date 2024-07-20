import { NextRequest, NextResponse } from 'next/server'

import PATH from '@/constants/path'

const privateRoutes = [PATH.ACCOUNT, PATH.CART, PATH.ADMIN] as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  if (privateRoutes.some((route) => pathname.startsWith(route)) && !accessToken) {
    return NextResponse.redirect(new URL(PATH.HOME, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/cart/:path*', '/admin/:path*']
}
