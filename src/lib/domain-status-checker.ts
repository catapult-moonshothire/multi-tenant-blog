// lib/domain-status-checker.ts
import db from "./db";

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

async function checkPendingDomains() {
  try {
    // Get all domains with status 'pending'
    const domains = await db.query(
      undefined,
      "SELECT subdomain, custom_domain, cloudflare_data FROM blogs WHERE cloudflare_data IS NOT NULL"
    );

    for (const domain of domains) {
      if (!domain.cloudflare_data) continue;

      const cloudflareData = JSON.parse(domain.cloudflare_data);

      // Skip domains that are already active
      if (cloudflareData.status === "active") continue;

      const zoneId = cloudflareData.id;

      // Check the current status
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}`,
        {
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.result) {
          // Update the database with the latest status
          await db.query(
            undefined,
            "UPDATE blogs SET cloudflare_data = ?, updated_at = CURRENT_TIMESTAMP WHERE custom_domain = ?",
            [JSON.stringify(data.result), domain.custom_domain]
          );

          console.log(
            `Updated status for ${domain.custom_domain}: ${data.result.status}`
          );

          // If the domain is now active, we might want to set up DNS records or SSL
          if (
            data.result.status === "active" &&
            cloudflareData.status !== "active"
          ) {
            console.log(
              `Domain ${domain.custom_domain} is now active. Setting up DNS...`
            );
            await setupDNSRecords(zoneId, domain.subdomain);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error checking pending domains:", error);
  }
}

async function setupDNSRecords(zoneId: string, subdomain: string) {
  try {
    // Replace with your app's domain
    const appDomain = process.env.APP_DOMAIN || "yourblogapp.com";

    // Create A record
    await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CNAME",
          name: "@",
          content: `${subdomain}.${appDomain}`,
          ttl: 1,
          proxied: true,
        }),
      }
    );

    // Create www CNAME record
    await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CNAME",
          name: "www",
          content: `${subdomain}.${appDomain}`,
          ttl: 1,
          proxied: true,
        }),
      }
    );

    console.log(`DNS records set up for ${subdomain}`);
  } catch (error) {
    console.error(`Error setting up DNS records for ${subdomain}:`, error);
  }
}

// Function to start the periodic check
export function startDomainStatusChecker(intervalMinutes = 30) {
  // Initial check
  checkPendingDomains();

  // Set up periodic check
  const intervalMs = intervalMinutes * 60 * 1000;
  const interval = setInterval(checkPendingDomains, intervalMs);

  return () => clearInterval(interval); // Return a cleanup function
}

export default {
  checkPendingDomains,
  startDomainStatusChecker,
};
