# ── Hansonian OS — Makefile ──────────────────────────────────────────────────
# Usage:
#   make dev-gateway          # run gateway in dev mode
#   make build-all            # build all Next.js apps
#   make lint-all             # lint all apps
#   make docker-build         # build all Docker images locally
#   make docker-push          # push all images to Artifact Registry
#   make cloud-build          # submit build to Google Cloud Build
#   make setup                # first-time install for all apps
#
# Required env vars for push targets:
#   GCP_PROJECT   — GCP project ID
#   SHORT_SHA     — image tag (defaults to git short SHA)

SHELL := /bin/bash

APPS      := gateway admin-web employee-ops family-portal
APPS_WEB  := apps/web
REGISTRY  ?= australia-southeast1-docker.pkg.dev/$(GCP_PROJECT)/hansonian
SHORT_SHA ?= $(shell git rev-parse --short HEAD)

.PHONY: help setup dev-gateway dev-admin dev-employee dev-family dev-apps-web \
        lint-all build-all type-check-all \
        docker-build docker-push docker-build-push \
        cloud-build flutter-analyze flutter-build \
        clean

# ── Help ────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "Hansonian OS — Available targets"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "  setup              Install deps for all apps"
	@echo ""
	@echo "  dev-gateway        Run gateway dev server"
	@echo "  dev-admin          Run admin-web dev server"
	@echo "  dev-employee       Run employee-ops dev server"
	@echo "  dev-family         Run family-portal dev server"
	@echo "  dev-apps-web       Run apps/web dev server"
	@echo ""
	@echo "  lint-all           Lint all apps"
	@echo "  build-all          Build all apps"
	@echo "  type-check-all     Type-check all apps"
	@echo ""
	@echo "  docker-build       Build all Docker images"
	@echo "  docker-push        Push all images to Artifact Registry"
	@echo "  docker-build-push  Build + push in one step"
	@echo ""
	@echo "  cloud-build        Submit build to Google Cloud Build"
	@echo ""
	@echo "  flutter-analyze    Analyze Flutter mobile app"
	@echo "  flutter-build      Build Flutter APK"
	@echo ""
	@echo "  clean              Remove all .next build artifacts"
	@echo ""

# ── Setup ───────────────────────────────────────────────────────────────────
setup:
	@echo "→ Installing dependencies for all apps..."
	@for app in $(APPS); do \
		echo "  npm ci: $$app"; \
		cd $$app && npm ci && cd ..; \
	done
	@cd $(APPS_WEB) && npm ci && cd ../..
	@echo "→ Flutter deps..."
	@cd apps/mobile && flutter pub get && cd ../..
	@echo "✓ Setup complete"

# ── Dev servers ─────────────────────────────────────────────────────────────
dev-gateway:
	cd gateway && npm run dev

dev-admin:
	cd admin-web && npm run dev

dev-employee:
	cd employee-ops && npm run dev

dev-family:
	cd family-portal && npm run dev

dev-apps-web:
	cd $(APPS_WEB) && npm run dev

# ── Lint ─────────────────────────────────────────────────────────────────────
lint-all:
	@echo "→ Linting all apps..."
	@FAILED=""; \
	for app in $(APPS); do \
		echo "  lint: $$app"; \
		(cd $$app && npm run lint) || FAILED="$$FAILED $$app"; \
	done; \
	(cd $(APPS_WEB) && npm run lint) || FAILED="$$FAILED apps/web"; \
	if [ -n "$$FAILED" ]; then echo "✗ Lint failed:$$FAILED" && exit 1; fi
	@echo "✓ All lint checks passed"

# ── Type check ───────────────────────────────────────────────────────────────
type-check-all:
	@echo "→ Type-checking all apps..."
	@for app in $(APPS); do \
		echo "  tsc: $$app"; \
		(cd $$app && npx tsc --noEmit) || true; \
	done
	@(cd $(APPS_WEB) && npx tsc --noEmit) || true
	@echo "✓ Type-check complete"

# ── Build ────────────────────────────────────────────────────────────────────
build-all:
	@echo "→ Building all apps..."
	@FAILED=""; \
	for app in $(APPS); do \
		echo "  build: $$app"; \
		(cd $$app && npm run build) || FAILED="$$FAILED $$app"; \
	done; \
	(cd $(APPS_WEB) && npm run build) || FAILED="$$FAILED apps/web"; \
	if [ -n "$$FAILED" ]; then echo "✗ Build failed:$$FAILED" && exit 1; fi
	@echo "✓ All builds complete"

# ── Docker ───────────────────────────────────────────────────────────────────
docker-build:
	@echo "→ Building Docker images (tag: $(SHORT_SHA))..."
	docker build -f gateway/Dockerfile      -t $(REGISTRY)/gateway:$(SHORT_SHA)      -t $(REGISTRY)/gateway:latest      .
	docker build -f admin-web/Dockerfile    -t $(REGISTRY)/admin-web:$(SHORT_SHA)    -t $(REGISTRY)/admin-web:latest    .
	docker build -f employee-ops/Dockerfile -t $(REGISTRY)/employee-ops:$(SHORT_SHA) -t $(REGISTRY)/employee-ops:latest .
	docker build -f family-portal/Dockerfile -t $(REGISTRY)/family-portal:$(SHORT_SHA) -t $(REGISTRY)/family-portal:latest .
	docker build -f $(APPS_WEB)/Dockerfile  -t $(REGISTRY)/apps-web:$(SHORT_SHA)    -t $(REGISTRY)/apps-web:latest     .
	@echo "✓ Docker images built"

docker-push:
	@echo "→ Pushing images to $(REGISTRY)..."
	@for svc in gateway admin-web employee-ops family-portal apps-web; do \
		docker push $(REGISTRY)/$$svc:$(SHORT_SHA); \
		docker push $(REGISTRY)/$$svc:latest; \
	done
	@echo "✓ Images pushed"

docker-build-push: docker-build docker-push

# ── Cloud Build ──────────────────────────────────────────────────────────────
cloud-build:
	@if [ -z "$(GCP_PROJECT)" ]; then echo "✗ GCP_PROJECT is not set" && exit 1; fi
	gcloud builds submit \
		--project=$(GCP_PROJECT) \
		--config=cloudbuild.yaml \
		--substitutions=SHORT_SHA=$(SHORT_SHA) \
		.

# ── Flutter ──────────────────────────────────────────────────────────────────
flutter-analyze:
	cd apps/mobile && flutter analyze

flutter-build:
	cd apps/mobile && flutter build apk --release

# ── Clean ─────────────────────────────────────────────────────────────────────
clean:
	@echo "→ Removing .next build artifacts..."
	@for app in $(APPS); do rm -rf $$app/.next; done
	@rm -rf $(APPS_WEB)/.next
	@echo "✓ Clean complete"
