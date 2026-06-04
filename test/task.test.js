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
    .send({ name: "Juan", email: "Juan@capitole.com", password: "123456" });

  const adminRes = await request(app)
    .post("/auth/login")
    .send({ email: "admin@task.com", password: "capitoleC" });
  adminToken = adminRes.body.data.accessToken;

  const userRes = await request(app)
    .post("/auth/login")
    .send({ email: "Juan@capitole.com", password: "123456" });
  userToken = userRes.body.data.accessToken;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  if (collections.tasks) await collections.tasks.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("POST /tasks (roles)", () => {
  it("admin crea una tarea", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Mi tarea de test" });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Mi tarea de test");
    expect(res.body.data.completed).toBe(false);
  });

  it("user NO puede crear tarea (403)", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "X" });

    expect(res.status).toBe(403);
  });

  it("rechaza crear tarea sin token (401)", async () => {
    const res = await request(app).post("/tasks").send({ title: "X" });
    expect(res.status).toBe(401);
  });
});
