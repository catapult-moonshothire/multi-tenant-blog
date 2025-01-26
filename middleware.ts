// import db from "@/lib/db";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   const url = request.nextUrl.clone();
//   const { pathname } = url;
//   const hostname = request.headers.get("host") || "";

//   console.log("Middleware - Hostname:", hostname);

//   // Check if it's a custom domain or a subdomain of localhost
//   const currentHost =
//     process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
//       ? hostname.replace(`.blog.com`, "")
//       : hostname.replace(`.localhost:3000`, "");

//   console.log("Middleware - Current host:", currentHost);

//   // If it's the root domain, don't rewrite
//   if (hostname === "blog.com" || hostname === "localhost:3000") {
//     console.log("Middleware - Root domain detected, no rewrite");
//     return NextResponse.next();
//   }

//   // Check if it's a custom domain or subdomain
//   const [blog] = await db.query(
//     "SELECT * FROM blogs WHERE subdomain = ? OR custom_domain = ?",
//     [currentHost, hostname]
//   );

//   console.log("Middleware - Database query result:", blog);

//   if (blog) {
//     // Rewrite to /[subdomain]/[...slug]
//     url.pathname = `/${blog.subdomain}${pathname}`;
//     console.log("Middleware - Rewriting to:", url.pathname);
//     return NextResponse.rewrite(url);
//   }

//   // If no blog found, return 404
//   console.log("Middleware - No blog found, returning 404");
//   return new NextResponse(null, { status: 404 });
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const url = request.nextUrl;
//   const hostname = request.headers.get("host") || "";

//   // Determine the current host based on environment
//   const currentHost =
//     process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
//       ? hostname.replace(`.abhinavbaldha.com`, "")
//       : hostname.replace(`.localhost:3000`, "");

//   console.log("Middleware - Hostname:", hostname);
//   console.log("Middleware - Current host:", currentHost);

//   // Exclude API routes and static files
//   if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
//     return NextResponse.next();
//   }

//   // Handle root domain (e.g., abhinavbaldha.com or localhost)
//   if (hostname === "abhinavbaldha.com" || hostname === "localhost:3000") {
//     console.log("Middleware - Root domain detected, no rewrite");
//     return NextResponse.next();
//   }

//   // Handle blog post routes for subdomains
//   if (url.pathname.startsWith("/blog/")) {
//     const newUrl = new URL(`/${currentHost}${url.pathname}`, request.url);
//     console.log("Middleware - Rewriting blog post to:", newUrl.pathname);
//     return NextResponse.rewrite(newUrl);
//   }

//   // Rewrite for all other subdomains
//   const newUrl = new URL(`/${currentHost}${url.pathname}`, request.url);
//   console.log("Middleware - Rewriting to:", newUrl.pathname);
//   return NextResponse.rewrite(newUrl);
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  // Exclude API routes and static files
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Handle root domain
  if (hostname === "localhost:3000" || hostname === "blog.localhost:3000") {
    console.log("Middleware - Root domain detected");
    return NextResponse.next(); // Show the default landing page
  }

  // Handle subdomain requests
  if (subdomain && subdomain !== "localhost" && subdomain !== "blog") {
    console.log("Middleware - Subdomain detected:", subdomain);
    const newUrl = new URL(url.pathname, request.url);
    return NextResponse.rewrite(new URL(`/`, newUrl)); // Rewrite to subdomain's root
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
