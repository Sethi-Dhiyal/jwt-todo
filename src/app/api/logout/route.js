// src/app/api/logout/route.js
import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST() {
  await clearAuthCookies(); // cookies clear instantly
  return NextResponse.json({ message: "Logged out" });
}
