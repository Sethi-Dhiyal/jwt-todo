// src/app/api/refresh/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateTokens, setAuthCookies } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) throw new Error("No refresh token");

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = getUserByEmail(payload.email);
    if (!user) throw new Error("User not found");

    const tokens = generateTokens(user);
    await setAuthCookies(tokens);

    return NextResponse.json({ message: "Token refreshed", user: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
