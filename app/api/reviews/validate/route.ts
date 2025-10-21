// app/api/reviews/validate/route.ts
import { NextResponse } from "next/server";
import { validateReviewToken, removeReviewToken } from "@/lib/reviews";

export const dynamic = "force-dynamic"; // чтобы не кэшировалось Vercel

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

    // Удаляем токен сразу после проверки, чтобы использовать можно было один раз
    await removeReviewToken(token);

    return NextResponse.json({ ok: true, message: "token_valid" });
  } catch (error: any) {
    console.error("Validate token error:", error);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
