import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return NextResponse.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ user: { id: decoded.id, email: decoded.email } });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
