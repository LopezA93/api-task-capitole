import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  if (collections.users) await collections.users.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Auth", () => {
  it("registra un usuario y lo devuelve con rol user + token", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Juan", email: "juan@task.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("user");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("login correcto devuelve un accessToken", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Ana", email: "ana@task.com", password: "123456" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ana@task.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("login con password incorrecta devuelve 401", async () => {
    await request(app)
      .post("/auth/register")
      .send({ name: "Ana", email: "ana@task.com", password: "123456" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ana@task.com", password: "incorrecta" });

    expect(res.status).toBe(401);
  });
});
