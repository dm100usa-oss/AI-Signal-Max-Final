import { NextResponse } from "next/server";
import { getData } from "@/lib/storage";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    // Only handle Stripe checkout completion
    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;
    const email = session.customer_details?.email;
    const metadata = session.metadata || {};
    const url = metadata.url;
    const mode = metadata.mode as "quick" | "pro";

    if (!email || !url || mode !== "pro") {
      return NextResponse.json({ message: "No email or not Pro mode." });
    }

    // Retrieve stored analysis data
    const analysis = await getData(url);
    if (!analysis) {
      console.error("No cached analysis found for:", url);
      return NextResponse.json({ message: "No cached analysis found." });
    }

    // Generate both PDFs
    const ownerBuffer = await generatePDF({
      type: "owner",
      data: analysis,
    });

    const developerBuffer = await generatePDF({
      type: "developer",
      data: analysis,
    });

    // Send email with attachments
    await sendReportEmail({
      to: email,
      subject: "AI Signal Max — Full Website Visibility Report",
      html: `
        <p>Hello,</p>
        <p>Your full website visibility report for <strong>${url}</strong> is ready.</p>
        <p>Attached you will find two PDF documents:</p>
        <ul>
          <li><strong>Owner Report</strong> — overview and recommendations.</li>
          <li><strong>Developer Checklist</strong> — detailed technical guidance.</li>
        </ul>
        <p>Best regards,<br>AI Signal Max Team</p>
      `,
      attachments: [
        { filename: "Owner_Report.pdf", content: ownerBuffer },
        { filename: "Developer_Checklist.pdf", content: developerBuffer },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
