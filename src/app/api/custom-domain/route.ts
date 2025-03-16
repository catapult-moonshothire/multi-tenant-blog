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
  try {
    const { subdomain, customDomain } = await request.json();
    console.log("Received request:", { subdomain, customDomain });

    if (!subdomain || !customDomain) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Subdomain and custom domain are required" },
        { status: 400 }
      );
    }

    // Step 1: Add the custom domain to Cloudflare
    console.log("Sending request to Cloudflare...");
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
          type: "full",
        }),
      }
    );

    const cloudflareData = await cloudflareResponse.json();
    console.log("Cloudflare response:", cloudflareData);

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

    // Step 2: Update the database with the custom domain and Cloudflare data
    console.log("Updating database...");
    await db.query(
      undefined,
      "UPDATE blogs SET custom_domain = ?, cloudflare_data = ?, updated_at = CURRENT_TIMESTAMP WHERE subdomain = ?",
      [customDomain, JSON.stringify(cloudflareData.result), subdomain]
    );
    console.log("Database updated successfully!");

    return NextResponse.json({
      success: true,
      cloudflareResponse: cloudflareData,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
