require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

let token;

const testUser = {
  name: "Test User",
  email: `test${Date.now()}@example.com`,
  password: "123456"
};

beforeAll(async () => {
  await connectDB();

  // Register user
  await request(app)
    .post("/api/auth/register")
    .send(testUser);

  // Login user
  const res = await request(app)
    .post("/api/auth/login")
    .send(testUser);

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Records API", () => {

  it("should create a record (authorized)", async () => {
    const res = await request(app)
      .post("/api/records")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 100,
        type: "expense",
        category: "food",
        date: "2026-04-01",
        notes: "lunch"
      });

    expect(res.statusCode).toBe(201);
  });

  it("should fail without token", async () => {
    const res = await request(app)
      .post("/api/records")
      .send({
        amount: 100,
        type: "expense",
        category: "food"
      });

    expect(res.statusCode).toBe(401);
  });

  it("should get records with pagination", async () => {
    const res = await request(app)
      .get("/api/records?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("totalRecords");
  });

});