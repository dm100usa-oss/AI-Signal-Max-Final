import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, reportUrl } = await req.json();

    const data = await resend.emails.send({
      from: "AI Signal Pro <noreply@aivcheck.com>",
      to: email,
      subject: "Your AI Visibility Pro Report",
      html: `
        <h2>Thank you for using AI Signal Pro</h2>
        <p>Your website visibility report is ready.</p>
        <p><a href="${reportUrl}">Click here to download your report</a></p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
