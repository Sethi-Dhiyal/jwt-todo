// src/app/api/me/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return NextResponse.json({ user: null }, { status: 401 });

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = getUserByEmail(payload.email);
    if (!user) return NextResponse.json({ user: null }, { status: 404 });

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
