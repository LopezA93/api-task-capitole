import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

let mongod;
let adminToken;
let userToken;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  await User.create({
    name: "Admin Capitole",
    email: "admin@task.com",
    password: "capitoleC",
    role: "admin",
  });

  await request(app)
    .post("/auth/register")
    .send({ name: "Juan", email: "juan@task.com", password: "123456" });

  const adminRes = await request(app)
    .post("/auth/login")
    .send({ email: "admin@task.com", password: "capitoleC" });
  adminToken = adminRes.body.data.accessToken;

  const userRes = await request(app)
    .post("/auth/login")
    .send({ email: "juan@task.com", password: "123456" });
  userToken = userRes.body.data.accessToken;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("GET /users (admin-only)", () => {
  it("admin obtiene la lista de usuarios", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("user NO puede listar usuarios (403)", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
