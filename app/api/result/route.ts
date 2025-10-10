// app/api/result/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

let lastResult: any = null;

// Save last analysis result
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    lastResult = data;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to save result" },
      { status: 500 }
    );
  }
}

// Get last analysis result
export async function GET() {
  if (!lastResult) {
    return NextResponse.json(
      { error: "No result stored yet" },
      { status: 404 }
    );
  }
  return NextResponse.json(lastResult);
}
