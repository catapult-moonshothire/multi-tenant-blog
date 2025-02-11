// // app/api/custom-domain/route.ts
// import db from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const { subdomain, customDomain } = await request.json();

//   try {
//     // Update the database with the custom domain
//     await db.query(
//       "main",
//       "UPDATE blogs SET custom_domain = ? WHERE subdomain = ?",
//       [customDomain, subdomain]
//     );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error updating custom domain:", error);
//     return NextResponse.json(
//       { error: "Failed to update custom domain" },
//       { status: 500 }
//     );
//   }
// }

// app/api/custom-domain/route.ts
import db from "@/lib/db";
import { NextResponse } from "next/server";

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

export async function POST(request: Request) {
  const { subdomain, customDomain } = await request.json();

  if (!subdomain || !customDomain) {
    return NextResponse.json(
      { error: "Subdomain and custom domain are required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Update the database with the custom domain
    await db.query(
      "main",
      "UPDATE blogs SET custom_domain = ? WHERE subdomain = ?",
      [customDomain, subdomain]
    );

    // Step 2: Add the custom domain to Cloudflare
    const cloudflareResponse = await fetch(
      "https://api.cloudflare.com/client/v4/zones",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: {
            id: CLOUDFLARE_ACCOUNT_ID,
          },
          name: customDomain,
          type: "full", // Use "full" for full setup (DNS and proxy)
        }),
      }
    );

    const cloudflareData = await cloudflareResponse.json();

    if (!cloudflareResponse.ok) {
      console.error("Cloudflare API error:", cloudflareData);
      return NextResponse.json(
        {
          error: "Failed to add domain to Cloudflare",
          details: cloudflareData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cloudflareResponse: cloudflareData,
    });
  } catch (error) {
    console.error("Error updating custom domain:", error);
    return NextResponse.json(
      { error: "Failed to update custom domain" },
      { status: 500 }
    );
  }
}
