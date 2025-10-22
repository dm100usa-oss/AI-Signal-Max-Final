// 🔸 Добавляем первую строку:
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { validateReviewToken } from "@/lib/reviewTokens";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    const valid = await validateReviewToken(token);

    if (!valid) {
      console.warn("Token invalid or expired:", token);
      return NextResponse.json({ ok: false, error: "invalid_or_expired" }, { status: 403 });
    }

    // не удаляем токен на этом этапе — удалим только после отправки отзыва
    return NextResponse.json({ ok: true, message: "token_valid" });
  } catch (err: any) {
    console.error("Validate token error:", err);
    return NextResponse.json({ ok: false, error: err.message || "server_error" }, { status: 500 });
  }
}
