// app/api/reviews/validate/route.ts
import { NextResponse } from "next/server";
import { validateReviewToken, removeReviewToken } from "@/lib/reviews";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    const valid = await validateReviewToken(token);

    if (!valid) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 403 });
    }

    // Делает токен одноразовым
    await removeReviewToken(token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Validate token error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
