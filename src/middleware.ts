import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

let domainMappings: Record<string, string> = {};
let lastFetchTime = 0;

async function fetchSubdomains() {
  try {
    console.log("Middleware - Starting subdomain fetch from API");
    const res = await fetch("https://inscribe.so/api/subdomains");
    const data = await res.json();
    if (data.success) {
      console.log("Middleware - Successfully fetched subdomains:", data.data);
      domainMappings = data.data;
      lastFetchTime = Date.now();
    } else {
      console.warn("Middleware - Subdomain fetch returned unsuccessful:", data);
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
    pathname: url.pathname,
  });

  // Bypass for image paths and static assets
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes(".") || // Static files
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/images") || // Add /uploads to the bypass condition
    url.pathname.startsWith("/uploads")
  ) {
    console.log("Middleware - Bypassing middleware for path:", url.pathname);
    return NextResponse.next();
  }

  const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "inscribe.so";

  // Refresh domain mappings every 10 minutes
  if (Date.now() - lastFetchTime > 10 * 60 * 1000) {
    console.log("Middleware - Refreshing domain mappings (10 minute interval)");
    await fetchSubdomains();
  } else {
    console.log("Middleware - Using cached domain mappings");
  }

  // Handle main domain with subdomain in path (e.g., inscribe.so/abhinav)
  if (hostname === MAIN_DOMAIN) {
    console.log("Middleware - Handling main domain request");
    const pathParts = url.pathname.split("/");
    const potentialSubdomain = pathParts[1];

    if (potentialSubdomain) {
      try {
        console.log(
          `Middleware - Checking path subdomain: ${potentialSubdomain}`
        );
        const customDomainResponse = await fetch(
          `https://${MAIN_DOMAIN}/api/get-custom-domain?subdomain=${potentialSubdomain}`
        );
        const customDomainData = await customDomainResponse.json();

        if (customDomainData.customDomain) {
          console.log(
            `Middleware - Found custom domain mapping: ${potentialSubdomain} -> ${customDomainData.customDomain}`
          );

          const remainingPath = pathParts.slice(2).join("/");
          const newPath = remainingPath ? `/${remainingPath}` : "/";

          console.log(`Middleware - Constructed new path: ${newPath}`);
          const response = NextResponse.redirect(
            `https://${customDomainData.customDomain}${newPath}`,
            { status: 301 }
          );

          response.headers.set("Cache-Control", "public, max-age=31536000");
          return response;
        }
      } catch (error) {
        console.error("Middleware - Error in path subdomain handling:", error);
      }
    }
  }

  // Handle subdomain requests (e.g., abhinav.inscribe.so)
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${MAIN_DOMAIN}`, "");
    console.log(`Middleware - Handling subdomain request: ${subdomain}`);

    try {
      const customDomainResponse = await fetch(
        `https://${MAIN_DOMAIN}/api/get-custom-domain?subdomain=${subdomain}`
      );
      const customDomainData = await customDomainResponse.json();

      if (customDomainData.customDomain) {
        console.log(
          `Middleware - Redirecting subdomain to custom domain: ${customDomainData.customDomain}`
        );

        const response = NextResponse.redirect(
          `https://${customDomainData.customDomain}${url.pathname}`,
          { status: 301 }
        );

        response.headers.set("Cache-Control", "public, max-age=31536000");
        return response;
      }
    } catch (error) {
      console.error("Middleware - Error in subdomain handling:", error);
    }
  }

  // Handle custom domains (e.g., godsofgrowth.com)
  if (hostname !== MAIN_DOMAIN && !hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    console.log("Middleware - Handling custom domain request");
    const subdomain = domainMappings[hostname];

    if (subdomain) {
      console.log(
        `Middleware - Found subdomain mapping: ${hostname} -> ${subdomain}`
      );

      if (!url.pathname.startsWith(`/${subdomain}`)) {
        const newPath = `/${subdomain}${url.pathname}`;
        console.log(`Middleware - Rewriting path to: ${newPath}`);
        url.pathname = newPath;
      } else {
        console.log(
          "Middleware - Path already contains subdomain, skipping rewrite"
        );
      }
    } else {
      console.log("Middleware - No subdomain mapping found for custom domain");
    }

    return NextResponse.rewrite(url);
  }

  console.log("Middleware - No conditions matched, passing through");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|uploads).*)"],
};
