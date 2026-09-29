import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { redis } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const raw = await redis.lrange("reviews:pending", 0, -1);

    const reviews = (raw || [])
      .map((item: any) => {
        if (typeof item === "string") {
          return JSON.parse(item);
        }

        if (item instanceof Uint8Array) {
          return JSON.parse(new TextDecoder().decode(item));
        }

        if (typeof item === "object" && item !== null) {
          return item;
        }

        return null;
      })
      .filter(Boolean);

    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("Error loading pending reviews:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
