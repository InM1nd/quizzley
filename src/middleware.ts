import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Получаем ответ
  const response = NextResponse.next();

  // Добавляем заголовки безопасности
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://generativelanguage.googleapis.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Добавляем заголовки для API роутов
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Добавляем заголовки для статических ресурсов
  if (
    request.nextUrl.pathname.match(
      /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/
    )
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // Блокируем доступ к чувствительным файлам
  const sensitivePaths = [
    "/.env",
    "/.git",
    "/package.json",
    "/package-lock.json",
    "/yarn.lock",
    "/pnpm-lock.yaml",
    "/.npmrc",
    "/.yarnrc",
    "/.gitignore",
    "/README.md",
    "/CHANGELOG.md",
    "/LICENSE",
    "/tsconfig.json",
    "/next.config.js",
    "/tailwind.config.js",
    "/postcss.config.js",
    "/drizzle.config.ts",
    "/vercel.json",
  ];

  if (sensitivePaths.some((path) => request.nextUrl.pathname.includes(path))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Блокируем доступ к системным файлам
  const systemPaths = [
    "/.well-known",
    "/.htaccess",
    "/.htpasswd",
    "/web.config",
    "/robots.txt",
    "/sitemap.xml",
  ];

  if (systemPaths.some((path) => request.nextUrl.pathname.includes(path))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Добавляем заголовки для аутентификации
  if (request.nextUrl.pathname.startsWith("/api/auth/")) {
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
