// app/api/reviews/validate/route.ts
import { NextResponse } from "next/server";
import { validateReviewToken, removeReviewToken } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    const valid = await validateReviewToken(token);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "invalid_or_expired" }, { status: 403 });
    }

    // одноразовое использование
    await removeReviewToken(token);
    return NextResponse.json({ ok: true, message: "token_valid" });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "server_error" },
      { status: 500 }
    );
  }
}
