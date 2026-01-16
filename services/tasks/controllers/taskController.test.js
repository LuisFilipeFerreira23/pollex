import { describe, it, expect, beforeEach, vi } from "vitest";
import * as taskController from "./taskController.js";
import dbmanager from "../database/dbmanager.js";

vi.mock("../database/dbmanager.js");

describe("Task Controller Unit Tests", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe("getTasks", () => {
    it("should return 200 and all tasks", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1" },
        { id: 2, title: "Task 2" },
      ];

      dbmanager.Task.findAll.mockResolvedValue(mockTasks);

      await taskController.getTasks(mockReq, mockRes, mockNext);

      expect(dbmanager.Task.findAll).toHaveBeenCalledWith({ limit: 10 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should return 500 when database throws an error", async () => {
      const mockError = new Error("Database connection failed");
      dbmanager.Task.findAll.mockRejectedValue(mockError);

      await taskController.getTasks(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error:",
        error: "Database connection failed",
      });
    });
  });

  describe("getTaskById", () => {
    it("should return 200 and a specific task", async () => {
      const mockTask = [{ id: 1, title: "Task 1" }];
      mockReq.params.id = "1";

      dbmanager.Task.findAll.mockResolvedValue(mockTask);

      await taskController.getTaskById(mockReq, mockRes, mockNext);

      expect(dbmanager.Task.findAll).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 200 with empty array when task not found", async () => {
      mockReq.params.id = "999";
      dbmanager.Task.findAll.mockResolvedValue([]);

      await taskController.getTaskById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it("should return 500 when database throws an error", async () => {
      const mockError = new Error("Database query failed");
      mockReq.params.id = "1";
      dbmanager.Task.findAll.mockRejectedValue(mockError);

      await taskController.getTaskById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error:",
        error: "Database query failed",
      });
    });
  });

  describe("addTask", () => {
    it("should return 200 and create a new task", async () => {
      const mockTask = { id: 1, title: "New Task" };
      mockReq.body.title = "New Task";

      dbmanager.Task.create.mockResolvedValue(mockTask);

      await taskController.addTask(mockReq, mockRes, mockNext);

      expect(dbmanager.Task.create).toHaveBeenCalledWith({ title: "New Task" });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ results: mockTask });
    });

    it("should handle undefined title gracefully", async () => {
      mockReq.body.title = undefined;
      const mockTask = { id: 1, title: undefined };

      dbmanager.Task.create.mockResolvedValue(mockTask);

      await taskController.addTask(mockReq, mockRes, mockNext);

      expect(dbmanager.Task.create).toHaveBeenCalledWith({ title: undefined });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 when database throws an error", async () => {
      const mockError = new Error("Failed to create task");
      mockReq.body.title = "New Task";
      dbmanager.Task.create.mockRejectedValue(mockError);

      await taskController.addTask(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error:",
        error: "Failed to create task",
      });
    });
  });

  describe("updateTask", () => {
    it("should return 200 and update a task successfully", async () => {
      mockReq.params.id = "1";
      mockReq.body.title = "Updated Task";

      dbmanager.Task.update.mockResolvedValue(1);

      await taskController.updateTask(mockReq, mockRes, mockNext);

      expect(dbmanager.Task.update).toHaveBeenCalledWith(
        { title: "Updated Task" },
        { where: { id: "1" } }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Task updated successfully",
      });
    });

    it("should return 404 when task does not exist", async () => {
      mockReq.params.id = "999";
      mockReq.body.title = "Updated Task";

      dbmanager.Task.update.mockResolvedValue(0);

      await taskController.updateTask(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Task not found",
      });
    });

    it("should return 500 when database throws an error", async () => {
      const mockError = new Error("Database update failed");
      mockReq.params.id = "1";
      mockReq.body.title = "Updated Task";
      dbmanager.Task.update.mockRejectedValue(mockError);

      await taskController.updateTask(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error:",
        error: "Database update failed",
      });
    });
  });

  describe("deleteTask", () => {
    it("should return 200 and delete a task successfully", async () => {
      mockReq.params.id = "1";

      dbmanager.Task.destroy.mockResolvedValue(1);

      await taskController.deleteTask(mockReq, mockRes, mockNext);

      expect(dbmanager.Task.destroy).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
      });
    });

    it("should return 404 when task does not exist", async () => {
      mockReq.params.id = "999";

      dbmanager.Task.destroy.mockResolvedValue(0);

      await taskController.deleteTask(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Task not found",
      });
    });

    it("should return 500 when database throws an error", async () => {
      const mockError = new Error("Database delete failed");
      mockReq.params.id = "1";
      dbmanager.Task.destroy.mockRejectedValue(mockError);

      await taskController.deleteTask(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error:",
        error: "Database delete failed",
      });
    });
  });
});
