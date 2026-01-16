import { vi } from "vitest";

// Mock sequelize
vi.mock("sequelize", () => {
  const mockSequelize = class {
    constructor() {}
    define() {
      return {};
    }
    sync() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
  };

  return {
    Sequelize: mockSequelize,
    DataTypes: {
      INTEGER: "INTEGER",
      STRING: "STRING",
      TEXT: "TEXT",
      BOOLEAN: "BOOLEAN",
      DATE: "DATE",
    },
  };
});

// Mock the database module
vi.mock("../tasks/database/database.js", () => ({
  syncModels: vi.fn().mockResolvedValue(true),
  authenticationCheck: vi.fn().mockResolvedValue(true),
}));

// Mock the dbmanager with proper Task model methods
vi.mock("../tasks/database/dbmanager.js", () => ({
  default: {
    Task: {
      findAll: vi.fn().mockResolvedValue([
        { id: 1, title: "Test Task 1" },
        { id: 2, title: "Test Task 2" },
      ]),
      findByPk: vi.fn().mockResolvedValue({ id: 1, title: "Test Task" }),
      create: vi.fn().mockResolvedValue({ id: 1, title: "Test Task" }),
      update: vi.fn((data, options) => {
        // Return 0 rows affected if ID is 99999 (non-existent task)
        if (options?.where?.id === "99999") {
          return Promise.resolve(0);
        }
        return Promise.resolve(1);
      }),
      destroy: vi.fn((options) => {
        // Return 0 rows affected if ID is 99999 (non-existent task)
        if (options?.where?.id === "99999") {
          return Promise.resolve(0);
        }
        return Promise.resolve(1);
      }),
    },
  },
}));
