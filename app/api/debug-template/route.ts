import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filename = "developer.html";
  const filePath = path.join(process.cwd(), "public", "templates", filename);
  const template = await fs.readFile(filePath, "utf8");
  return NextResponse.json({
    path: filePath,
    preview: template.slice(0, 500),
  });
}
