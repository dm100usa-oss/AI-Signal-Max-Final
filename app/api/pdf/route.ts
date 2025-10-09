// app/api/pdf/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { analyze } from "@/lib/analyze";
import { prepareData } from "@/lib/prepareData";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET(_req: NextRequest) {
  try {
    // Example test website and mode (you can replace later)
    const website = "https://example.com";
    const mode = "pro";

    // Run analysis
    const result = await analyze(website, mode);

    // Prepare structured data
    const dataOwner = prepareData(result);
    const dataDeveloper = prepareData(result);

    // Convert all values to strings (TypeScript safety)
    const dataOwnerStr = Object.fromEntries(
      Object.entries(dataOwner).map(([k, v]) => [k, String(v)])
    );
    const dataDeveloperStr = Object.fromEntries(
      Object.entries(dataDeveloper).map(([k, v]) => [k, String(v)])
    );

    // Generate PDFs
    const ownerBuffer = await generatePDF({ type: "owner", data: dataOwnerStr });
    const developerBuffer = await generatePDF({ type: "developer", data: dataDeveloperStr });

    // Send both PDFs via email
    await sendReportEmail({
      to: "dm100usa@gmail.com",
      url: website,
      mode,
      ownerBuffer,
      developerBuffer,
    });

    return new NextResponse("PDFs generated and email sent", { status: 200 });
  } catch (err) {
    console.error("PDF route error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

// Helper for inline logo loading
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
