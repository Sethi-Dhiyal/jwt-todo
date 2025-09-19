import { NextResponse } from "next/server";
import { verifyPassword, generateTokens, setAuthCookies } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    await setAuthCookies({ accessToken, refreshToken }); // ✅ await added

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
