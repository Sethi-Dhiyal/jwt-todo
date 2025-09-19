// src/app/api/signup/route.js
import { NextResponse } from "next/server";
import { addUser, getUserByEmail } from "@/lib/db";
import { hashPassword, generateTokens, setAuthCookies } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  const user = { id: Date.now().toString(), email, password: hashed };

  addUser(user);

  // generate tokens and set cookies so user is logged-in immediately
  const tokens = generateTokens(user);
  await setAuthCookies(tokens);

  return NextResponse.json({ message: "User created", user: { id: user.id, email: user.email } });
}
