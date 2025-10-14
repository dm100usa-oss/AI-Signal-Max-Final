// app/api/result/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    const data = await getData(url);

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in /api/result:", error);
    return NextResponse.json(
      { error: "Failed to retrieve data", detail: error.message },
      { status: 500 }
    );
  }
}
