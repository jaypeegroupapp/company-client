import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

// 🔐 Protected pages (DO NOT include "/" here)
const protectedRoutes = [
  "/trucks",
  "/orders",
  "/profile",
  "company-invoices",
  "truck-orders",
];

// 🌐 Public pages
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 🔐 Protect "/" manually (home page requires auth)
  const isHome = path === "/";

  // Public pages
  const isPublicRoute = publicRoutes.includes(path);

  // Protected if exact match or starts with route (except "/")
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    protectedRoutes.some((route) => route !== "/" && path.startsWith(route));

  // Registration wizard routes
  const isRegistration =
    path.includes("/register/company") || path.includes("welcome");

  // 🔑 Get cookies & decrypt session
  const cookie = (await cookies()).get("session")?.value;
  const registrationStep = (await cookies()).get("registrationStep")?.value;
  const session = await decrypt(cookie);

  // ------------------------------------------
  // 🚫 Not authenticated → accessing protected route or home
  // ------------------------------------------
  if (!session?.userId && (isProtectedRoute || isHome)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // ------------------------------------------
  // 📝 User logged-in but registration incomplete
  // ------------------------------------------
  if (!isRegistration && registrationStep === "0") {
    return NextResponse.redirect(new URL("/register/company", req.nextUrl));
  }

  // ------------------------------------------
  // 🔄 Logged-in user should not see login/register again
  // ------------------------------------------
  if (session?.userId && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Exclude API, Next.js internals, static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
