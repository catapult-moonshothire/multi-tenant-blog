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

// import db from "@/lib/db";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   const url = request.nextUrl;
//   const hostname = request.headers.get("host") || "";
//   const subdomain = hostname.split(".")[0];

//   // Exclude API routes and static files
//   if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
//     return NextResponse.next();
//   }

//   // Handle root domain
//   if (hostname === "localhost:3000" || hostname === "135.181.35.223") {
//     console.log("Middleware - Root domain detected");
//     return NextResponse.next(); // Show the default landing page
//   }

//   // Handle custom domain requests
//   try {
//     const [blog] = await db.query(
//       "main",
//       "SELECT subdomain FROM blogs WHERE custom_domain = ?",
//       [hostname]
//     );

//     if (blog) {
//       const newUrl = new URL(`/${blog.subdomain}${url.pathname}`, request.url);
//       return NextResponse.rewrite(newUrl);
//     }
//   } catch (error) {
//     console.error("Middleware - Error handling custom domain:", error);
//   }

//   // Handle subdomain requests
//   if (
//     subdomain &&
//     subdomain !== "localhost" &&
//     subdomain !== "blog" &&
//     subdomain !== "www"
//   ) {
//     console.log("Middleware - Subdomain detected:", subdomain);
//     const newUrl = new URL(url.pathname, request.url);
//     return NextResponse.rewrite(new URL(`/`, newUrl)); // Rewrite to subdomain's root
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import db from "@/lib/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Exclude API routes and static files
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Extract the main domain from environment variable or default to xxyy.in
  const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "xxyy.in";

  // Handle root domain
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
    console.log("Middleware - Root domain detected");
    return NextResponse.next();
  }

  try {
    let subdomain: string | null = null;

    // Check if this is a custom domain
    const [customDomainBlog] = await db.query(
      undefined,
      "SELECT subdomain FROM blogs WHERE custom_domain = ?",
      [hostname]
    );

    if (customDomainBlog) {
      subdomain = customDomainBlog.subdomain;
      console.log("Middleware - Custom domain detected:", hostname);
      console.log("Middleware - Mapping to subdomain:", subdomain);
    } else {
      // Check if it's a subdomain
      const potentialSubdomain = hostname.replace(`.${MAIN_DOMAIN}`, "");
      if (potentialSubdomain && potentialSubdomain !== "www") {
        const [subdomainBlog] = await db.query(
          undefined,
          "SELECT subdomain FROM blogs WHERE subdomain = ?",
          [potentialSubdomain]
        );
        if (subdomainBlog) {
          subdomain = potentialSubdomain;
          console.log("Middleware - Subdomain detected:", subdomain);
        }
      }
    }

    if (subdomain) {
      // Rewrite to the subdomain path
      const newUrl = new URL(`/${subdomain}${url.pathname}`, request.url);
      return NextResponse.rewrite(newUrl);
    }
  } catch (error) {
    console.error("Middleware - Error handling domain:", error);
  }

  // If no matching custom domain or subdomain is found, continue to 404
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
