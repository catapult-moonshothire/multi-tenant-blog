// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// let domainMappings: Record<string, string> = {};
// let lastFetchTime = 0;

// // Fetch subdomain mappings from API
// async function fetchSubdomains() {
//   try {
//     const res = await fetch("https://xxyy.in/api/subdomains");
//     const data = await res.json();
//     if (data.success) {
//       domainMappings = data.data;
//       lastFetchTime = Date.now();
//     }
//   } catch (error) {
//     console.error("Middleware - Error fetching subdomain mappings:", error);
//   }
// }

// export async function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   const hostname = req.headers.get("host") || "";

//   console.log("Middleware - Request received:", {
//     url: url.toString(),
//     hostname,
//   });

//   // Skip middleware for API or internal requests
//   if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
//     return NextResponse.next();
//   }

//   const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "xxyy.in";

//   // Refresh domain mappings every 10 minutes
//   if (Date.now() - lastFetchTime > 10 * 60 * 1000) {
//     await fetchSubdomains();
//   }

//   const subdomain = domainMappings[hostname];

//   // Allow /admin and /login for custom domains
//   if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/login")) {
//     return NextResponse.next();
//   }

//   // Handle custom domains (e.g., anyday.club)
//   if (hostname !== MAIN_DOMAIN && !hostname.endsWith(`.${MAIN_DOMAIN}`)) {
//     console.log(`Middleware - Custom domain detected: ${hostname}`);

//     // If the URL contains the subdomain in the path, redirect to the same URL without the subdomain
//     if (subdomain && url.pathname.startsWith(`/${subdomain}`)) {
//       const newPath = url.pathname.replace(`/${subdomain}`, "");
//       const newUrl = new URL(newPath, `https://${hostname}`);
//       return NextResponse.redirect(newUrl);
//     }

//     // Rewrite the URL without the subdomain prefix
//     return NextResponse.rewrite(url);
//   }

//   // Handle subdomains (e.g., dhaval.xxyy.in)
//   if (subdomain) {
//     console.log(`Middleware - Proxying ${hostname} to subdomain ${subdomain}`);

//     // ✅ Ensure we do NOT prepend subdomain if it's already included in the path
//     if (!url.pathname.startsWith(`/${subdomain}`)) {
//       url.pathname = `/${subdomain}${url.pathname}`;
//     }

//     return NextResponse.rewrite(url);
//   }

//   return NextResponse.next();
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

// // import type { NextRequest } from "next/server";
// // import { NextResponse } from "next/server";

// // let domainMappings: Record<string, string> = {};
// // let lastFetchTime = 0;

// // // Fetch subdomain mappings from API
// // async function fetchSubdomains() {
// //   try {
// //     const res = await fetch("https://xxyy.in/api/subdomains");
// //     const data = await res.json();
// //     if (data.success) {
// //       domainMappings = data.data;
// //       lastFetchTime = Date.now();
// //     }
// //   } catch (error) {
// //     console.error("Middleware - Error fetching subdomain mappings:", error);
// //   }
// // }

// // export async function middleware(req: NextRequest) {
// //   const url = req.nextUrl.clone();
// //   const hostname = req.headers.get("host") || "";

// //   console.log("Middleware - Request received:", {
// //     url: url.toString(),
// //     hostname,
// //   });

// //   // Skip middleware for API or internal requests
// //   if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
// //     return NextResponse.next();
// //   }

// //   const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "xxyy.in";

// //   // Refresh domain mappings every 10 minutes
// //   if (Date.now() - lastFetchTime > 10 * 60 * 1000) {
// //     await fetchSubdomains();
// //   }

// //   const subdomain = domainMappings[hostname];

// //   // Allow /admin and /login for custom domains
// //   if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/login")) {
// //     return NextResponse.next();
// //   }

// //   // Handle custom domains (e.g., anyday.club)
// //   if (hostname !== MAIN_DOMAIN && !hostname.endsWith(`.${MAIN_DOMAIN}`)) {
// //     console.log(`Middleware - Custom domain detected: ${hostname}`);

// //     // Rewrite the URL to include the subdomain internally
// //     if (subdomain && !url.pathname.startsWith(`/${subdomain}`)) {
// //       const newPath = `/${subdomain}${url.pathname}`;
// //       console.log(`Middleware - Rewriting ${url.pathname} to ${newPath}`);
// //       url.pathname = newPath;
// //     }

// //     return NextResponse.rewrite(url);
// //   }

// //   // Handle subdomains (e.g., dhaval.xxyy.in)
// //   if (subdomain) {
// //     console.log(`Middleware - Proxying ${hostname} to subdomain ${subdomain}`);

// //     // ✅ Ensure we do NOT prepend subdomain if it's already included in the path
// //     if (!url.pathname.startsWith(`/${subdomain}`)) {
// //       url.pathname = `/${subdomain}${url.pathname}`;
// //     }

// //     return NextResponse.rewrite(url);
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: [
// //     /*
// //      * Match all request paths except for the ones starting with:
// //      * - api (API routes)
// //      * - _next/static (static files)
// //      * - _next/image (image optimization files)
// //      * - favicon.ico (favicon file)
// //      */
// //     "/((?!api|_next/static|_next/image|favicon.ico).*)",
// //   ],
// // };

// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

let domainMappings: Record<string, string> = {};
let lastFetchTime = 0;

// Fetch subdomain mappings from API
async function fetchSubdomains() {
  try {
    const res = await fetch("https://xxyy.in/api/subdomains");
    const data = await res.json();
    if (data.success) {
      domainMappings = data.data;
      lastFetchTime = Date.now();
    }
  } catch (error) {
    console.error("Middleware - Error fetching subdomain mappings:", error);
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  console.log("Middleware - Request received:", {
    url: url.toString(),
    hostname,
  });

  // Skip middleware for API or internal requests
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "xxyy.in";

  // Refresh domain mappings every 10 minutes
  if (Date.now() - lastFetchTime > 10 * 60 * 1000) {
    await fetchSubdomains();
  }

  const subdomain = domainMappings[hostname];

  // Allow /admin and /login for custom domains
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Handle custom domains (e.g., anyday.club)
  if (hostname !== MAIN_DOMAIN && !hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    console.log(`Middleware - Custom domain detected: ${hostname}`);

    // Rewrite the URL to include the subdomain internally
    if (subdomain && !url.pathname.startsWith(`/${subdomain}`)) {
      const newPath = `/${subdomain}${url.pathname}`;
      console.log(`Middleware - Rewriting ${url.pathname} to ${newPath}`);
      url.pathname = newPath;
    }

    return NextResponse.rewrite(url);
  }

  // Handle subdomains (e.g., dhaval.xxyy.in)
  if (subdomain) {
    console.log(`Middleware - Proxying ${hostname} to subdomain ${subdomain}`);

    // ✅ Ensure we do NOT prepend subdomain if it's already included in the path
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${url.pathname}`;
    }

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

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
};
