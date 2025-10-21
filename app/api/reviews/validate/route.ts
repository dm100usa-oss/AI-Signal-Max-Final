import { NextResponse } from "next/server";
import { validateReviewToken } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" });
    }

    const valid = await validateReviewToken(token);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "invalid_token" });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Validate token error:", e);
    return NextResponse.json({ ok: false, error: "server_error" });
  }
}
