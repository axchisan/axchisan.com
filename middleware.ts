import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith("/api/auth")) return true
        if (req.nextUrl.pathname === "/") return true
        if (req.nextUrl.pathname.startsWith("/blog")) return true
        if (req.nextUrl.pathname.startsWith("/projects")) return true
        if (req.nextUrl.pathname.startsWith("/contact")) return true
        if (req.nextUrl.pathname.startsWith("/auth")) return true

        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
