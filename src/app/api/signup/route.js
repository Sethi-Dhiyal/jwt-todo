import { NextResponse } from "next/server";
import { hashPassword, generateTokens, setAuthCookies } from "@/lib/auth";
import { findUserByEmail, createUser } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
    };

    await createUser(user);

    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies({ accessToken, refreshToken });

    return NextResponse.json({
      message: "User created successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Signup error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
