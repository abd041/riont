import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/auth")) {
    return await updateSession(request);
  }

  if (pathname.startsWith("/admin")) {
    return await updateSession(request);
  }

  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get("location")) {
    return intlResponse;
  }

  return await updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
