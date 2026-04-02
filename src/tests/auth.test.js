require("dotenv").config();

const request= require('supertest');
const app= require('../app');

const mongoose = require("mongoose");
const connectDB = require("../config/db");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Auth API",()=>{
    const testUser={
        name:"testUser",
        email: `test${Date.now()}@example.com`,
        password:"Test@1234",
    }

    it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message","User registered successfully");
  });

   it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });


  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(400);
  });

})