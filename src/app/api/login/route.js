// src/app/api/login/route.js
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword, generateTokens, setAuthCookies } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();
  const user = getUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const tokens = generateTokens(user);
  await setAuthCookies(tokens);

  return NextResponse.json({ message: "Logged in", user: { id: user.id, email: user.email } });
}
