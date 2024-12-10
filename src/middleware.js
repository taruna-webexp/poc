import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected and unprotected routes
export const ProtectedRoutes = ["/admin", "/admin/orders/allorders", "/admin/orders/completeorders", "/admin/dashboard"];
export const UnprotectedRoutes = ["/auth/signin"];

// Middleware function
export async function middleware(request) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // Check if the route is protected
  const isProtectedRoute = ProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  // Check if the route is unprotected
  const isUnprotectedRoute = UnprotectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect logged-in users away from unprotected routes
  if (isUnprotectedRoute && token) {
    return NextResponse.redirect(new URL(ProtectedRoutes[0], request.url));
    //redirect the user to the first protected route in the ProtectedRoutes array (/admin/order).
  }

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(UnprotectedRoutes[0], request.url));
    // redirect them to the first unprotected route in the UnprotectedRoutes array ( /auth/signin).
  }

  // Allow all other routes
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: ["/admin/:path*"], // Matches all paths under "/admin/"
};
