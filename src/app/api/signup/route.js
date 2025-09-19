import { NextResponse } from "next/server";
import { hashPassword, generateTokens, setAuthCookies } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const user = await createUser({ email, password: hashed });

    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies({ accessToken, refreshToken });

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Signup error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
