import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "templates");
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".html"));
    const result = files.map(f => ({
      name: f,
      preview: fs.readFileSync(path.join(dir, f), "utf8").slice(0, 400)
    }));
    return NextResponse.json({ templates: result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
