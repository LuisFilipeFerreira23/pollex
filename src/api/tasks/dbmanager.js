// Importa o pool do PostgreSQL
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOSTNAME,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD),
  database: process.env.POSTGRES_DATABASE
});

async function createTables() {
  // example
  // await pool.query(`
  //   CREATE TABLE IF NOT EXISTS users (
  //     id SERIAL PRIMARY KEY,
  //     username VARCHAR(50) UNIQUE NOT NULL,
  //     password_hash TEXT NOT NULL,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   );
  // `);

  await pool.query (`
    CREATE TABLE IF NOT EXISTS tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    --space_id UUID NOT NULL REFERENCES spaces(space_id),
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK(status IN ('backlog', 'todo', 'in_progress', 'review', 'done', 'archived')),
    priority VARCHAR(20) CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    --assigned_to UUID REFERENCES users(user_id),
    --created_by UUID NOT NULL REFERENCES users(user_id),
    due_date TIMESTAMP NULL,
    estimated_hours DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- Optimized indexes for common query patterns
    --CREATE INDEX idx_tasks_space_id ON tasks(space_id);
    --CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
    --CREATE INDEX idx_tasks_status ON tasks(status);
    --CREATE INDEX idx_tasks_space_status ON tasks(space_id, status);  -- Composite index
    --CREATE INDEX idx_tasks_due_date ON tasks(due_date);
    --CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
    `)

  // --CHECK IF IT WORKS
  // print tables
  // console.log(
  //   await pool.query(`
  //   SELECT table_name 
  //   FROM information_schema.tables 
  //   WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  // `));
}

export default { pool, createTables };