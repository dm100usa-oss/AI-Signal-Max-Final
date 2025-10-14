import { NextResponse } from "next/server";
import { getData } from "@/lib/storage";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;
    const email = session.customer_details?.email;
    const metadata = session.metadata || {};
    const url = metadata.url;
    const mode = metadata.mode as "quick" | "pro";

    if (!email || !url) {
      return NextResponse.json({ message: "Missing email or URL" });
    }

    // Only send PDFs for Pro mode
    if (mode === "pro") {
      const analysis = await getData(url);
      if (!analysis) {
        console.error("No cached analysis found for:", url);
        return NextResponse.json({ message: "No cached analysis found" });
      }

      const ownerBuffer = await generatePDF({ type: "owner", data: analysis });
      const developerBuffer = await generatePDF({ type: "developer", data: analysis });

      await sendReportEmail({
        to: email,
        url,
        mode,
        ownerBuffer,
        developerBuffer,
        score: Number(analysis.score || 0),
        results: analysis,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
