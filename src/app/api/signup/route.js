import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";
import { hashPassword, generateTokens, setAuthCookies } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (getUserByEmail(email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const user = createUser(email, hashed);

    const tokens = generateTokens(user);
    await setAuthCookies(tokens);

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Signup error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
