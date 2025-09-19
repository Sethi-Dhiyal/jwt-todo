import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "1h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  return { accessToken, refreshToken };
}

export async function setAuthCookies({ accessToken, refreshToken }) {
  const cookieStore = await cookies();
  const secureFlag = process.env.NODE_ENV === "production";

  cookieStore.set({ name: "accessToken", value: accessToken, httpOnly: true, path: "/", sameSite: "lax", secure: secureFlag, maxAge: 60 * 60 });
  cookieStore.set({ name: "refreshToken", value: refreshToken, httpOnly: true, path: "/", sameSite: "lax", secure: secureFlag, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set({ name: "accessToken", value: "", httpOnly: true, path: "/", maxAge: 0 });
  cookieStore.set({ name: "refreshToken", value: "", httpOnly: true, path: "/", maxAge: 0 });
}
