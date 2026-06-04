import "dotenv/config";
import app from "../src/app.js";
import connectionMongoDB from "../src/config/db.js";

let conn;

export default async function handler(req, res) {
  if (!conn) conn = connectionMongoDB();
  await conn;
  return app(req, res);
}
