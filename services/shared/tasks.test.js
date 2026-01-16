import supertest from "supertest";
import jwt from "jsonwebtoken";
import app from "../tasks/app.js";
import { describe, it, expect } from "vitest";

const request = supertest(app);
const mockToken = jwt.sign(
  { userId: "1", email: "test@example.com" },
  process.env.JWT_PRIVATE_KEY || "test-secret-key"
);

describe("Task Controller Endpoints", () => {
  describe("GET /tasks - getTasks", () => {
    it("should return 200 and a list of tasks", async () => {
      const response = await request
        .get("/tasks")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 500 when no token is provided", async () => {
      const response = await request.get("/tasks");

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("No Token provided");
    });
  });

  describe("GET /tasks/:id - getTaskById", () => {
    it("should return 200 and a specific task", async () => {
      const response = await request
        .get("/tasks/1")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 500 when no token is provided", async () => {
      const response = await request.get("/tasks/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("No Token provided");
    });
  });

  describe("POST /tasks/create - addTask", () => {
    it("should return 200 and create a new task", async () => {
      const taskData = { title: "Test Task" };
      const response = await request
        .post("/tasks/create")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(taskData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("results");
    });

    it("should return 500 when no token is provided", async () => {
      const taskData = { title: "Test Task" };
      const response = await request.post("/tasks/create").send(taskData);

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("No Token provided");
    });

    it("should return 200 when title is missing", async () => {
      const response = await request
        .post("/tasks/create")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({});

      expect(response.status).toBe(200);
    });
  });

  describe("PUT /tasks/update/:id - updateTask", () => {
    it("should return 200 and update an existing task", async () => {
      const updateData = { title: "Updated Task" };
      const response = await request
        .put("/tasks/update/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain("updated successfully");
    });

    it("should return 404 when task does not exist", async () => {
      const updateData = { title: "Updated Task" };
      const response = await request
        .put("/tasks/update/99999")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("not found");
    });

    it("should return 500 when no token is provided", async () => {
      const updateData = { title: "Updated Task" };
      const response = await request.put("/tasks/update/1").send(updateData);

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("No Token provided");
    });
  });

  describe("DELETE /tasks/delete/:id - deleteTask", () => {
    it("should return 200 and delete a task", async () => {
      const response = await request
        .delete("/tasks/delete/1")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain("deleted successfully");
    });

    it("should return 404 when task does not exist", async () => {
      const response = await request
        .delete("/tasks/delete/99999")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("not found");
    });

    it("should return 500 when no token is provided", async () => {
      const response = await request.delete("/tasks/delete/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("No Token provided");
    });
  });
});
