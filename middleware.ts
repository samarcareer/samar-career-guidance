import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // 1. Initial Response setup
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Initialize Edge-Safe Supabase Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 Middleware Block: Supabase Env keys missing at Edge!");
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request cookie
          request.cookies.set({ name, value, ...options })
          // Update response cookie
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Update request cookie
          request.cookies.set({ name, value: '', ...options })
          // Update response cookie
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Verify Session Securely at Edge
  const { data: { session } } = await supabase.auth.getSession()

  const currentPath = request.nextUrl.pathname;
  
  // 🛑 PROTECTED ROUTES LIST (Add any future secure routes here)
  const protectedRoutes = ['/profile', '/assessment', '/admin'];

  // RULE A: Unauthenticated user trying to access a secure route -> Redirect to Login
  if (!session && protectedRoutes.some(route => currentPath.startsWith(route))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // RULE B: Authenticated user trying to access the login page -> Redirect to Profile
  if (session && currentPath === '/login') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/profile'
    return NextResponse.redirect(redirectUrl)
  }

  // Allow request to proceed if no rules are broken
  return response
}

// 4. Matcher Configuration (Optimize to only run on necessary routes)
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder files (.svg, .png, .jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
