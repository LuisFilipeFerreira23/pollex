# ============================================================
#  Project Makefile
# ============================================================

ENV_FILE := .env

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
CYAN   := \033[0;36m
RESET  := \033[0m

.PHONY: help start stop down \
        start-docs start-tasks start-users start-gateway \
        stop-docs stop-tasks stop-users stop-gateway \
        logs logs-docs logs-tasks logs-users logs-gateway \
        ps

## ── Help ──────────────────────────────────────────────────
help:
	@echo ""
	@echo "$(CYAN)╔══════════════════════════════════════════╗$(RESET)"
	@echo "$(CYAN)║           Available Commands             ║$(RESET)"
	@echo "$(CYAN)╚══════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(GREEN)  Start all services:$(RESET)"
	@echo "    make start"
	@echo ""
	@echo "$(GREEN)  Start individual services:$(RESET)"
	@echo "    make start-docs"
	@echo "    make start-tasks"
	@echo "    make start-users"
	@echo "    make start-gateway"
	@echo ""
	@echo "$(YELLOW)  Stop all services:$(RESET)"
	@echo "    make stop"
	@echo ""
	@echo "$(YELLOW)  Stop individual services:$(RESET)"
	@echo "    make stop-docs"
	@echo "    make stop-tasks"
	@echo "    make stop-users"
	@echo "    make stop-gateway"
	@echo ""
	@echo "$(GREEN)  Other:$(RESET)"
	@echo "    make ps         → lista containers a correr"
	@echo "    make logs       → logs de todos os serviços"
	@echo "    make logs-docs  → logs do serviço docs"
	@echo "    make logs-tasks → logs do serviço tasks"
	@echo "    make logs-users → logs do serviço users"
	@echo "    make logs-gateway → logs do serviço gateway"
	@echo "    make down       → remove containers, redes e volumes"
	@echo ""

## ── Start All ─────────────────────────────────────────────
start: check-docker check-env
	@echo "$(CYAN)▶ A iniciar todos os microserviços...$(RESET)"
	@$(MAKE) start-docs
	@$(MAKE) start-tasks
	@$(MAKE) start-users
	@$(MAKE) start-gateway
	@echo "$(GREEN)✔ Todos os serviços estão a correr!$(RESET)"

## ── Start Individual ──────────────────────────────────────
start-docs: check-docker check-env
	@echo "$(CYAN)▶ A iniciar Docs...$(RESET)"
	docker compose -p docs -f docker/docs/compose.yaml --env-file $(ENV_FILE) up --build -d

start-tasks: check-docker check-env
	@echo "$(CYAN)▶ A iniciar Tasks...$(RESET)"
	docker compose -p tasks -f docker/tasks/compose.yaml --env-file $(ENV_FILE) up --build -d

start-users: check-docker check-env
	@echo "$(CYAN)▶ A iniciar Users...$(RESET)"
	docker compose -p users -f docker/users/compose.yaml --env-file $(ENV_FILE) up --build -d

start-gateway: check-docker check-env
	@echo "$(CYAN)▶ A iniciar Gateway...$(RESET)"
	docker compose -p gateway -f docker/gateway/compose.yaml --env-file $(ENV_FILE) up --build -d

## ── Stop Individual ───────────────────────────────────────
stop-docs:
	@echo "$(YELLOW)■ A parar Docs...$(RESET)"
	docker compose -p docs -f docker/docs/compose.yaml --env-file $(ENV_FILE) stop

stop-tasks:
	@echo "$(YELLOW)■ A parar Tasks...$(RESET)"
	docker compose -p tasks -f docker/tasks/compose.yaml --env-file $(ENV_FILE) stop

stop-users:
	@echo "$(YELLOW)■ A parar Users...$(RESET)"
	docker compose -p users -f docker/users/compose.yaml --env-file $(ENV_FILE) stop

stop-gateway:
	@echo "$(YELLOW)■ A parar Gateway...$(RESET)"
	docker compose -p gateway -f docker/gateway/compose.yaml --env-file $(ENV_FILE) stop

## ── Stop All ──────────────────────────────────────────────
stop:
	@echo "$(YELLOW)■ A parar todos os microserviços...$(RESET)"
	@$(MAKE) stop-gateway
	@$(MAKE) stop-users
	@$(MAKE) stop-tasks
	@$(MAKE) stop-docs
	@echo "$(GREEN)✔ Todos os serviços parados.$(RESET)"

## ── Down (remove containers + networks) ──────────────────
down:
	@echo "$(YELLOW)▼ A remover todos os containers e redes...$(RESET)"
	docker compose -p docs     -f docker/docs/compose.yaml     --env-file $(ENV_FILE) down
	docker compose -p tasks    -f docker/tasks/compose.yaml    --env-file $(ENV_FILE) down
	docker compose -p users    -f docker/users/compose.yaml    --env-file $(ENV_FILE) down
	docker compose -p gateway  -f docker/gateway/compose.yaml  --env-file $(ENV_FILE) down
	@echo "$(GREEN)✔ Tudo removido.$(RESET)"

## ── Logs ──────────────────────────────────────────────────
logs:
	@echo "$(CYAN)📋 Logs de todos os serviços (Ctrl+C para sair)$(RESET)"
	docker compose -p docs     -f docker/docs/compose.yaml     --env-file $(ENV_FILE) logs -f &
	docker compose -p tasks    -f docker/tasks/compose.yaml    --env-file $(ENV_FILE) logs -f &
	docker compose -p users    -f docker/users/compose.yaml    --env-file $(ENV_FILE) logs -f &
	docker compose -p gateway  -f docker/gateway/compose.yaml  --env-file $(ENV_FILE) logs -f

logs-docs:
	docker compose -p docs -f docker/docs/compose.yaml --env-file $(ENV_FILE) logs -f

logs-tasks:
	docker compose -p tasks -f docker/tasks/compose.yaml --env-file $(ENV_FILE) logs -f

logs-users:
	docker compose -p users -f docker/users/compose.yaml --env-file $(ENV_FILE) logs -f

logs-gateway:
	docker compose -p gateway -f docker/gateway/compose.yaml --env-file $(ENV_FILE) logs -f

## ── Status ────────────────────────────────────────────────
ps:
	@echo "$(CYAN)📦 Containers a correr:$(RESET)"
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

## ── Guards ────────────────────────────────────────────────
check-docker:
	@if docker info > /dev/null 2>&1; then \
		echo "$(GREEN)✔ Docker já está a correr.$(RESET)"; \
	else \
		echo "$(YELLOW)⚠ Docker não está a correr. A tentar abrir...$(RESET)"; \
		case "$$(uname -s)" in \
			Darwin) open -a Docker ;; \
			Linux)  systemctl start docker 2>/dev/null || service docker start 2>/dev/null || \
			        (echo "$(YELLOW)⚠ Não foi possível iniciar o Docker automaticamente. Inicia manualmente.$(RESET)" && exit 1) ;; \
			MINGW*|CYGWIN*|MSYS*) start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" ;; \
			*) echo "$(YELLOW)⚠ Sistema operativo não reconhecido. Abre o Docker manualmente.$(RESET)" && exit 1 ;; \
		esac; \
		echo "$(CYAN)⏳ À espera que o Docker arranque...$(RESET)"; \
		for i in 1 2 3 4 5 6 7 8 9 10 11 12; do \
			sleep 5; \
			if docker info > /dev/null 2>&1; then \
				echo "$(GREEN)✔ Docker está pronto!$(RESET)"; \
				break; \
			fi; \
			echo "$(CYAN)   ainda a arrancar... ($$(( i * 5 ))s)$(RESET)"; \
			if [ "$$i" = "12" ]; then \
				echo "$(YELLOW)⚠ Docker demorou demasiado. Verifica se está instalado corretamente.$(RESET)"; \
				exit 1; \
			fi; \
		done; \
	fi

check-env:
	@test -f $(ENV_FILE) || \
		(echo "$(YELLOW)⚠ Ficheiro $(ENV_FILE) não encontrado na raiz do projeto.$(RESET)" && exit 1)
