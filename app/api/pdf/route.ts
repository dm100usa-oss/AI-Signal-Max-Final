import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/generatePDF";
import { sendReportEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { website, score, date, results, email, mode } = await req.json();

    if (!website || !score || !results) {
      return NextResponse.json(
        { error: "Missing required data for PDF generation" },
        { status: 400 }
      );
    }

    // Prepare data objects for both reports
    const dataForOwner = {
      website,
      score: String(score),
      date: date || new Date().toLocaleDateString("en-US"),
      results,
    };

    const dataForDeveloper = {
      website,
      score: String(score),
      date: date || new Date().toLocaleDateString("en-US"),
      results,
    };

    // Generate PDFs
    const ownerBuffer = await generatePDF({
      type: "owner",
      data: dataForOwner,
    });

    const developerBuffer = await generatePDF({
      type: "developer",
      data: dataForDeveloper,
    });

    // Send email with both PDFs — только для детальной проверки (pro)
    if (email && (mode || "pro") === "pro") {
      await sendReportEmail({
        to: email,
        url: website,
        mode: mode || "pro",
        ownerBuffer,
        developerBuffer,
        score,
        results,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "PDFs generated successfully",
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: error?.message || "PDF generation failed" },
      { status: 500 }
    );
  }
}
