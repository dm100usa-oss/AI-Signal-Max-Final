// app/api/result/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const mode = searchParams.get("mode") || "quick";
  if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

  const key = `${mode}:${url}`;
  const data = await getData(key);
  if (!data) return NextResponse.json({ error: "No data found" }, { status: 404 });

  return NextResponse.json(data);
}
