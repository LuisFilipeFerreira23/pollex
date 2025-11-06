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
  await pool.query (`
   -- Enable UUID generation extension
   CREATE EXTENSION IF NOT EXISTS pgcrypto;

   -- Users Microservice Tables (foundation)
   CREATE TABLE IF NOT EXISTS users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      avatar_url TEXT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      email_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL
   );

   CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
   CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
   CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

   -- Spaces Microservice Tables
   CREATE TABLE IF NOT EXISTS spaces (
      space_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      key VARCHAR(10) UNIQUE NOT NULL,
      description TEXT NULL,
      space_type VARCHAR(50) CHECK(space_type IN ('project', 'team', 'personal')),
      owner_id UUID NOT NULL,
      is_archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_spaces_owner_id ON spaces(owner_id);
   CREATE UNIQUE INDEX IF NOT EXISTS idx_spaces_key ON spaces(key);
   CREATE INDEX IF NOT EXISTS idx_spaces_archived ON spaces(is_archived);

   -- Tasks Microservice Tables
   CREATE TABLE IF NOT EXISTS tasks (
      task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      space_id UUID NOT NULL,
      title VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL CHECK(status IN ('backlog', 'todo', 'in_progress', 'review', 'done', 'archived')),
      priority VARCHAR(20) CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
      assigned_to UUID NULL,
      created_by UUID NOT NULL,
      due_date TIMESTAMP NULL,
      estimated_hours DECIMAL(5,2) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_tasks_space_id ON tasks(space_id);
   CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
   CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
   CREATE INDEX IF NOT EXISTS idx_tasks_space_status ON tasks(space_id, status);
   CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
   CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

   -- Docs Microservice Tables
   CREATE TABLE IF NOT EXISTS documents (
      doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      space_id UUID NOT NULL,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      content TEXT NOT NULL,
      content_type VARCHAR(50) NOT NULL CHECK(content_type IN ('markdown', 'html', 'plain_text')),
      author_id UUID NOT NULL,
      author_name VARCHAR(255) NULL,
      status VARCHAR(50) NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
      version INTEGER DEFAULT 1,
      schema_version INTEGER DEFAULT 1,
      tags TEXT[],
      related_tasks UUID[],
      attachments JSONB NULL,
      metadata JSONB NULL,
      can_view UUID[],
      can_edit UUID[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      published_at TIMESTAMP NULL
   );

   CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_slug ON documents(slug);
   CREATE INDEX IF NOT EXISTS idx_documents_space_status ON documents(space_id, status);
   CREATE INDEX IF NOT EXISTS idx_documents_author_id ON documents(author_id);
   CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING gin (tags);
   CREATE INDEX IF NOT EXISTS idx_documents_title_content ON documents USING gin (to_tsvector('english', title || ' ' || content));

   -- Management Microservice Tables
   CREATE TABLE IF NOT EXISTS reports (
      report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      report_type VARCHAR(100) NOT NULL,
      frequency VARCHAR(50) NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly', 'on_demand')),
      created_by UUID NOT NULL,
      last_run TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
   CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);

   CREATE TABLE IF NOT EXISTS integrations (
      integration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      integration_type VARCHAR(100) NOT NULL,
      config JSONB NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_integrations_type ON integrations(integration_type);
   CREATE INDEX IF NOT EXISTS idx_integrations_active ON integrations(is_active);

   -- Other dependent tables without foreign keys

   CREATE TABLE IF NOT EXISTS space_members (
      id BIGSERIAL PRIMARY KEY,
      space_id UUID NOT NULL,
      user_id UUID NOT NULL,
      role VARCHAR(50) NOT NULL CHECK(role IN ('owner', 'admin', 'member', 'viewer')),
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(space_id, user_id)
   );

   CREATE UNIQUE INDEX IF NOT EXISTS idx_space_members_composite ON space_members(space_id, user_id);
   CREATE INDEX IF NOT EXISTS idx_space_members_user ON space_members(user_id);

   CREATE TABLE IF NOT EXISTS user_sessions (
      session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      token_hash VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
   CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

   CREATE TABLE IF NOT EXISTS user_roles (
      user_id UUID NOT NULL,
      role_name VARCHAR(100) NOT NULL,
      scope VARCHAR(255) NOT NULL,
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      assigned_by UUID NULL,
      PRIMARY KEY (user_id, role_name, scope)
   );

   CREATE TABLE IF NOT EXISTS user_activity_logs (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL,
      action_type VARCHAR(100) NOT NULL,
      resource_type VARCHAR(100) NOT NULL,
      resource_id UUID NULL,
      ip_address INET NULL,
      user_agent TEXT NULL,
      metadata JSONB NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_user_activity_user_id_timestamp ON user_activity_logs(user_id, timestamp DESC);
   CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON user_activity_logs(timestamp DESC);
   CREATE INDEX IF NOT EXISTS idx_user_activity_action_type ON user_activity_logs(action_type);

   CREATE TABLE IF NOT EXISTS task_comments (
      comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL,
      comment_type VARCHAR(50) NOT NULL CHECK(comment_type IN ('comment', 'activity', 'system_update')),
      content TEXT NOT NULL,
      author_id UUID NOT NULL,
      mentions UUID[],
      attachments JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL,
      is_edited BOOLEAN DEFAULT FALSE,
      reactions JSONB
   );

   CREATE TABLE IF NOT EXISTS task_dependencies (
      task_id UUID NOT NULL,
      dependent_task_id UUID NOT NULL,
      dependency_type VARCHAR(20) CHECK(dependency_type IN ('blocks', 'requires')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (task_id, dependent_task_id)
   );

   CREATE TABLE IF NOT EXISTS task_subtasks (
      parent_task_id UUID NOT NULL,
      subtask_id UUID NOT NULL,
      order_position INTEGER,
      PRIMARY KEY (parent_task_id, subtask_id)
   );

   CREATE TABLE IF NOT EXISTS document_versions (
      id BIGSERIAL PRIMARY KEY,
      doc_id UUID NOT NULL,
      version INTEGER NOT NULL,
      title VARCHAR(255) NULL,
      content TEXT NULL,
      changed_by UUID NULL,
      change_summary TEXT NULL,
      snapshot_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_document_versions_doc_version ON document_versions(doc_id, version DESC);
   CREATE INDEX IF NOT EXISTS idx_document_versions_snapshot_date ON document_versions(snapshot_date DESC);

   CREATE TABLE IF NOT EXISTS analytics_events (
      id BIGSERIAL PRIMARY KEY,
      event_type VARCHAR(100) NOT NULL,
      space_id UUID NULL,
      user_id UUID NULL,
      aggregation_period VARCHAR(20) NOT NULL CHECK(aggregation_period IN ('hourly', 'daily', 'weekly')),
      metrics JSONB NULL,
      dimensions JSONB NULL,
      timestamp TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_analytics_event_timestamp ON analytics_events(event_type, timestamp DESC);
   CREATE INDEX IF NOT EXISTS idx_analytics_space_period ON analytics_events(space_id, aggregation_period);
   CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp DESC);

   CREATE TABLE IF NOT EXISTS teams (
      team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      description TEXT NULL
   );

   CREATE TABLE IF NOT EXISTS team_members (
      team_id UUID NOT NULL,
      user_id UUID NOT NULL,
      role VARCHAR(50) NULL,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(team_id, user_id)
   );

   CREATE TABLE IF NOT EXISTS team_spaces (
      team_id UUID NOT NULL,
      space_id UUID NOT NULL,
      ownership_type VARCHAR(50) NULL,
      PRIMARY KEY (team_id, space_id)
   );
`)
}

export default { pool, createTables };