import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  try {
    // Save test data
    await redis.set("test_key", "AI Signal Max storage works!");
    // Read test data
    const value = await redis.get("test_key");

    return NextResponse.json({
      success: true,
      message: "Storage test successful",
      stored_value: value,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Storage test failed",
      error: String(error),
    });
  }
}
