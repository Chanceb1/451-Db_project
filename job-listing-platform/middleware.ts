import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  // Paths that require authentication
  const authPaths = [
    "/profile",
    "/jobs/applications",
    "/jobs/saved",
    "/employer/profile",
    "/employer/jobs",
    "/employer/applications",
    "/admin/dashboard",
    "/admin/employers",
    "/admin/users",
    "/admin/jobs",
    "/notifications",
  ]

  // Check if the path requires authentication
  const requiresAuth = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // If the path requires authentication and there's no token, redirect to login
  if (requiresAuth && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If there's a token, verify it and check role-based access
  if (token) {
    try {
      const decoded = verifyToken(token)

      if (!decoded) {
        // Invalid token, clear it and redirect to login if on a protected path
        const response = NextResponse.next()
        response.cookies.delete("token")

        if (requiresAuth) {
          const url = new URL("/login", request.url)
          url.searchParams.set("callbackUrl", request.nextUrl.pathname)
          return NextResponse.redirect(url)
        }

        return response
      }

      // Role-based access control
      const { role } = decoded

      // Employer-only paths
      if (request.nextUrl.pathname.startsWith("/employer") && role !== "EMPLOYER") {
        return NextResponse.redirect(new URL("/", request.url))
      }

      // Admin-only paths
      if (request.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      // Handle token verification errors
      console.error("Token verification error:", error)
      const response = NextResponse.next()
      response.cookies.delete("token")

      if (requiresAuth) {
        const url = new URL("/login", request.url)
        return NextResponse.redirect(url)
      }

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

