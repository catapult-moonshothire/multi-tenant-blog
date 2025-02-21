import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { subdomain, newDomain } = await request.json();

  try {
    await resend.emails.send({
      from: "Abhinav from MoonshotHire <abhinav@moonshothire.com>",
      to: "abhinav@moonshothire.com",
      subject: "New Domain Request",
      html: `<p>A new domain has been requested:</p>
             <p>Subdomain: ${subdomain}</p>
             <p>Requested Domain: ${newDomain}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send domain request email" },
      { status: 500 }
    );
  }
}
