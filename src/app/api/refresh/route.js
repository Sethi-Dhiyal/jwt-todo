import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { generateTokens, setAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefresh } = generateTokens(decoded);

    setAuthCookies({ accessToken, refreshToken: newRefresh });

    return NextResponse.json({ message: "Tokens refreshed" });
  } catch (err) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 403 });
  }
}
