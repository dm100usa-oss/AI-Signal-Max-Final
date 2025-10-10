// app/api/webhook/route.ts
export const runtime = "nodejs";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";
import { analyze } from "@/lib/analyze";
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

    const customerEmail = session.customer_details?.email;
    const website = session.metadata?.url || "N/A";
    const mode = session.metadata?.mode || "pro";
    const date = new Date().toISOString().split("T")[0];

    // Only send emails and PDFs for "pro" mode
    if (mode !== "pro") {
      console.log("Quick mode — no email or PDF generation.");
      return new NextResponse("Quick mode — skipped.", { status: 200 });
    }

    try {
      if (customerEmail) {
        // Run full analysis
        const result = await analyze(website, "pro");

        const scoreNum = result.score;
        const assessment = buildAssessment(scoreNum);
        const donut_color = getDonutColor(scoreNum);
        const donut_offset = getDonutOffset(scoreNum);
        const base64_logo = await getLogoBase64();

        // Build statuses from analyzed factors
        const statuses: Record<string, "Good" | "Moderate" | "Poor"> = {};
        for (const item of result.items) {
          const key = item.key
            .replace("robots_txt", "robots")
            .replace("sitemap_xml", "sitemap")
            .replace("x_robots_tag", "xrobots")
            .replace("meta_robots", "meta")
            .replace("title_tag", "title")
            .replace("meta_description", "metadesc")
            .replace("open_graph", "og")
            .replace("h1_present", "h1")
            .replace("structured_data", "schema")
            .replace("mobile_friendly", "mobile")
            .replace("alt_attributes", "alt")
            .replace("page_404", "404");
          const status =
            item.passed === true
              ? "Good"
              : item.passed === null
              ? "Moderate"
              : "Poor";
          statuses[key] = status;
        }

        const cls = (s: "Good" | "Moderate" | "Poor") =>
          s === "Good" ? "good" : s === "Moderate" ? "moderate" : "poor";

        // Owner report data
        const ownerData: Record<string, string> = {
          base64_logo,
          website,
          date,
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

        // Developer report data
        const developerData: Record<string, string> = {
          base64_logo,
          website,
          date,
        };

        for (const key in statuses) {
          developerData[`status_${key}`] = statuses[key];
          developerData[`status_${key}_class`] = cls(statuses[key]);
        }

        // Generate PDFs
        const ownerBuffer = await generatePDF({ type: "owner", data: ownerData });
        const developerBuffer = await generatePDF({
          type: "developer",
          data: developerData,
        });

        // Send email
        await sendReportEmail({
          to: customerEmail,
          url: website,
          mode,
          ownerBuffer,
          developerBuffer,
        });

        console.log("Email with two PDFs sent to:", customerEmail);
      }

      return new NextResponse("Success", { status: 200 });
    } catch (err) {
      console.error("Error generating or sending PDF:", err);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new NextResponse("Event type not handled", { status: 200 });
}

// Helper: read logo as Base64
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
