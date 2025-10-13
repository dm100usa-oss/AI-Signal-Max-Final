import { NextResponse } from "next/server";
import { getData } from "@/lib/storage";
import { generateOwnerPDF, generateDeveloperPDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const event = await req.json();
    const url = event.data?.object?.metadata?.website;
    const mode = event.data?.object?.metadata?.mode || "quick";
    const customerEmail = event.data?.object?.customer_email;

    if (!url || !customerEmail) {
      console.error("Missing URL or customer email in webhook payload");
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const analysis = await getData(`${mode}:${url}`);
    if (!analysis) {
      console.error("No cached analysis found for session.");
      return NextResponse.json({ error: "No analysis found" }, { status: 404 });
    }

    // Generate two separate PDF reports
    const ownerBuffer = await generateOwnerPDF(analysis);
    const developerBuffer = await generateDeveloperPDF(analysis);

    await sendReportEmail({
      to: customerEmail,
      url,
      mode,
      ownerBuffer,
      developerBuffer,
      score: analysis.score,
      results: analysis.results,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
