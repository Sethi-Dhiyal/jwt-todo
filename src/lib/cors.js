export function setCorsHeaders(res) {
  res.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_FRONTEND_URL || "*");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
}
