import { NextResponse } from "next/server";
import { verifyPassword, generateTokens, setAuthCookies } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";
import { setCorsHeaders } from "@/lib/cors";

export async function POST(req) {
  const res = NextResponse.next();
  setCorsHeaders(res);

  try {
    const { email, password } = await req.json();
    const user = await findUserByEmail(email);

    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const { accessToken, refreshToken } = generateTokens(user);
    await setAuthCookies({ accessToken, refreshToken });

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  // This handles preflight requests automatically
  const res = NextResponse.next();
  setCorsHeaders(res);
  return res;
}
