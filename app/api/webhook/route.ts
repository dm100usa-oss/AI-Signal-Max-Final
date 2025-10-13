// app/api/webhook/route.ts
export const runtime = "nodejs";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";
import { getCache } from "@/lib/cache";
import { getDonutColor, getDonutOffset, buildAssessment } from "@/lib/pdfHelpers";
import fs from "node:fs/promises";
import path from "node:path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_email || session.metadata?.email || "";
    const mode = (session.metadata?.mode as "quick" | "pro") || "quick";
    const url = session.metadata?.url || "";
    const sessionId = session.metadata?.sessionId || "";

    // Retrieve cached analysis
    const cached =
      getCache(`session:${sessionId}`, mode) || getCache(url, mode);

    if (!cached) {
      console.error("No cached analysis found for session:", sessionId);
      return new NextResponse("No cached data found", { status: 200 });
    }

    const { score, results } = cached;

    // Only Pro mode sends email + PDFs
    if (mode !== "pro") {
      console.log("Quick mode — no email or PDF generation.");
      return new NextResponse("Quick mode — skipped.", { status: 200 });
    }

    try {
      const base64_logo = await getLogoBase64();
      const scoreNum = Number(score);
      const assessment = buildAssessment(scoreNum);
      const donut_color = getDonutColor(scoreNum);
      const donut_offset = getDonutOffset(scoreNum);

      // Build statuses for 15 factors
      const statuses: Record<string, "Good" | "Moderate" | "Poor"> = {};
      for (const [key, value] of Object.entries(results)) {
        const v: any = value;
        const passed = v?.passed ?? false;
        statuses[key] = passed
          ? "Good"
          : v === null
          ? "Moderate"
          : "Poor";
      }

      const cls = (s: "Good" | "Moderate" | "Poor") =>
        s === "Good" ? "good" : s === "Moderate" ? "moderate" : "poor";

      // === Owner PDF data ===
      const ownerData: Record<string, string> = {
        base64_logo,
        website: url,
        date: new Date().toLocaleDateString("en-US"),
        score: String(scoreNum),
        donut_color,
        donut_offset,
        visibility_level: assessment.level,
        assessment_p1: assessment.p1,
        assessment_p2: assessment.p2,
      };
      for (const key in statuses) {
        ownerData[`status_${key}`] = statuses[key];
        ownerData[`status_${key}_class`] = cls(statuses[key]);
      }

      // === Developer PDF data (no donut, no score) ===
      const developerData: Record<string, string> = {
        base64_logo,
        website: url,
        date: new Date().toLocaleDateString("en-US"),
      };
      for (const key in statuses) {
        developerData[`status_${key}`] = statuses[key];
        developerData[`status_${key}_class`] = cls(statuses[key]);
      }

      // Generate both PDFs
      const pdfOwner = await generatePDF({ type: "owner", data: ownerData });
      const pdfDeveloper = await generatePDF({
        type: "developer",
        data: developerData,
      });

      // Send email with both reports
      await sendReportEmail({
        to: email,
        url,
        mode,
        ownerBuffer: pdfOwner,
        developerBuffer: pdfDeveloper,
        score: scoreNum,
        results,
      });

      console.log("PDF reports successfully sent to:", email);
    } catch (err) {
      console.error("Error generating or sending PDF:", err);
    }
  }

  return new NextResponse("Success", { status: 200 });
}

// Helper: read logo file as base64
async function getLogoBase64(): Promise<string> {
  if (process.env.LOGO_BASE64) return process.env.LOGO_BASE64;
  const tryPaths = [
    path.join(process.cwd(), "public", "templates", "logo.png"),
    path.join(process.cwd(), "public", "logo.png"),
  ];
  for (const p of tryPaths) {
    try {
      const bin = await fs.readFile(p);
      return bin.toString("base64");
    } catch {}
  }
  return "";
}
