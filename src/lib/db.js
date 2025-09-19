// ❌ fs/path remove kar diye (Vercel me persist nahi hota)

// ✅ In-memory DB (Vercel-friendly)
// let users = [];

// /**
//  * Get all users
//  */
// export function getUsers() {
//   return users;
// }

// /**
//  * Add a new user
//  */
// export function addUser(user) {
//   users.push(user);
// }

// /**
//  * Get user by email
//  */
// export function getUserByEmail(email) {
//   return users.find((u) => u.email === email);
// }































import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");

function readDB() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getUsers() {
  return readDB().users;
}

export function addUser(user) {
  const db = readDB();
  db.users.push(user);
  writeDB(db);
}

export function getUserByEmail(email) {
  return getUsers().find((u) => u.email === email);
}







