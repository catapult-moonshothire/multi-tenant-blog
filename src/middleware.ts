import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

let domainMappings: Record<string, string> = {};
let lastFetchTime = 0;

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

  // Early return for static assets and API routes
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes(".") || // Static files
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/login")
  ) {
    return NextResponse.next();
  }

  const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "xxyy.in";

  // Refresh domain mappings every 10 minutes
  if (Date.now() - lastFetchTime > 10 * 60 * 1000) {
    await fetchSubdomains();
  }

  // Handle main domain with subdomain in path (e.g., xxyy.in/abhinav)
  if (hostname === MAIN_DOMAIN) {
    const pathParts = url.pathname.split("/");
    const potentialSubdomain = pathParts[1];

    if (potentialSubdomain) {
      try {
        const customDomainResponse = await fetch(
          `https://${MAIN_DOMAIN}/api/get-custom-domain?subdomain=${potentialSubdomain}`
        );
        const customDomainData = await customDomainResponse.json();

        if (customDomainData.customDomain) {
          console.log(
            `Middleware - Redirecting to custom domain: ${customDomainData.customDomain}`
          );
          // Get the remaining path after the subdomain
          const remainingPath = pathParts.slice(2).join("/");
          const newPath = remainingPath ? `/${remainingPath}` : "/";

          const response = NextResponse.redirect(
            `https://${customDomainData.customDomain}${newPath}`,
            {
              status: 301, // Changed from 307 to 301
            }
          );

          // Add cache control headers for better performance
          response.headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
          return response;
        }
      } catch (error) {
        console.error("Error fetching custom domain:", error);
      }
    }
  }

  // Handle subdomain requests (e.g., abhinav.xxyy.in)
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${MAIN_DOMAIN}`, "");
    try {
      const customDomainResponse = await fetch(
        `https://${MAIN_DOMAIN}/api/get-custom-domain?subdomain=${subdomain}`
      );
      const customDomainData = await customDomainResponse.json();

      if (customDomainData.customDomain) {
        console.log(
          `Middleware - Redirecting to custom domain: ${customDomainData.customDomain}`
        );

        const response = NextResponse.redirect(
          `https://${customDomainData.customDomain}${url.pathname}`,
          {
            status: 301, // Changed from 307 to 301
          }
        );

        // Add cache control headers for better performance
        response.headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
        return response;
      }
    } catch (error) {
      console.error("Error fetching custom domain:", error);
    }
  }

  // Handle custom domains (e.g., godsofgrowth.com)
  if (hostname !== MAIN_DOMAIN && !hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const subdomain = domainMappings[hostname];
    if (subdomain && !url.pathname.startsWith(`/${subdomain}`)) {
      const newPath = `/${subdomain}${url.pathname}`;
      console.log(`Middleware - Rewriting path to: ${newPath}`);
      url.pathname = newPath;
    }
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
