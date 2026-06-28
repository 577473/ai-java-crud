# JavaCRUD — Full-Stack User CRUD Demo

A full-stack web application demonstrating CRUD operations for system users, built as a learning project with [opencode](https://opencode.ai). The backend is a Spring Boot REST API secured with JWT authentication; the frontend is an Angular SPA with a neon-dark theme.

## Architecture Overview

```
┌─────────────┐  HTTP (REST/JSON)  ┌──────────────┐
│  Angular 22  │ ──── proxy ──────→ │ Spring Boot 3 │
│  localhost:4200 │   (dev only)     │ localhost:8080 │
│               │ ←─── JSON ──────── │               │
│  (standalone  │                    │  H2 (mem) DB  │
│   components) │                    │  JPA / Hibernate│
└──────────────┘                    └──────────────┘
```

- **Backend**: Java 21 + Spring Boot 3.3 + Spring Data JPA + Spring Security + H2 (default) / PostgreSQL
- **Frontend**: Angular 22 (standalone components, signals, signal forms)
- **Auth**: Stateless JWT (5-min access token, 30-min refresh token, rotation on refresh)
- **Build**: Maven (backend) + pnpm (frontend), separate deployable artifacts

## Project Structure

```
javacrud/
├── backend/               # Spring Boot application
│   ├── src/main/java/     # Java sources
│   │   └── com/javacrud/
│   │       ├── user/      # Entity, Repository, Service, Controller, DTO, Mapper
│   │       ├── auth/      # Login, JWT provider, token refresh
│   │       ├── config/    # Security (filter chain), CORS, JWT filter
│   │       ├── seed/      # Startup data seeder (1 admin + 5 users)
│   │       └── common/    # Global exception handler
│   └── src/main/resources/ # application.yml, profiles for H2 / PostgreSQL
├── frontend/              # Angular application
│   └── src/app/
│       ├── login/         # Login page (signal forms)
│       ├── home/          # Greeting page
│       ├── profile/       # View / edit own profile (signal forms)
│       ├── admin/         # Admin user management (signal forms)
│       ├── user-list/     # Reusable user table (signal inputs/outputs)
│       ├── notification/  # Toast notification component
│       ├── services/      # Auth, User, Token, Notification services
│       ├── guards/        # Auth guard, Admin guard
│       ├── interceptors/  # JWT injection, 401/403 redirect
│       └── models/        # User interface
├── specs/                 # Feature specification artifacts
│   └── 001-user-crud-demo/
│       ├── spec.md        # Full feature specification
│       ├── plan.md        # Implementation plan
│       ├── quickstart.md  # Quick start guide
│       ├── data-model.md  # Entity definition & validation rules
│       ├── contracts/     # API contracts & Postman collection
│       └── tasks.md       # Task breakdown
└── AGENTS.md              # opencode agent configuration
```

## Quick Start

### Prerequisites

- Java 21 JDK
- Node.js 20+ with pnpm (`npm i -g pnpm`)
- Angular CLI 22 (`pnpm add -g @angular/cli`)

### 1. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Starts on `http://localhost:8080` with H2 in-memory database. Seed data is loaded automatically.

### 2. Start the Frontend

```bash
cd frontend
pnpm install
ng serve
```

Starts on `http://localhost:4200`. API calls to `/api/*` are proxied to the backend automatically during development.

### 3. Login

| Username | Password | Role |
|----------|----------|------|
| admin | Admin123! | admin |
| jdoe | Password123! | user |
| jsmith | Password123! | user |
| alex_m | Password123! | user |
| sara_c | Password123! | user |
| mike_w | Password123! | user |

## Role-Based Authorization

| Endpoint | HTTP Method | Access | Description |
|----------|-------------|--------|-------------|
| `/api/auth/login` | POST | Public | Login, returns JWT |
| `/api/auth/refresh` | POST | Public | Refresh access token |
| `/api/users/me` | GET | Authenticated | Read own profile |
| `/api/users/me` | PUT | Authenticated | Update own profile |
| `/api/users` | GET | ADMIN | List all users |
| `/api/users` | POST | ADMIN | Create user |
| `/api/users/{id}` | GET | ADMIN | Get user by ID |
| `/api/users/{id}` | PUT | ADMIN | Update any user |
| `/api/users/{id}` | DELETE | ADMIN | Delete user |

## Frontend Implementation Notes

The Angular frontend uses modern Angular 22 patterns throughout:

- **Standalone components** — no NgModules, bootstrapped via `bootstrapApplication`
- **Signal forms** (`@angular/forms/signals`) — `form()`, `FormField`, `required()`, `email()`, `submit()`, `hidden()`, `readonly()` — for all form state management
- **`@if` / `@for` control flow** — replaces legacy `*ngIf` / `*ngFor`
- **Signal-based inputs/outputs** — `input()`, `output()` functions instead of `@Input()` / `@Output()` decorators
- **Reactive state** — `signal()` and `computed()` eliminate `ChangeDetectorRef` manual change detection
- **Functional interceptors** — `HttpInterceptorFn` with `withInterceptors` for JWT injection and error handling
- **Functional guards** — `CanActivateFn` for route protection

## How This Was Built with opencode

This project was generated and implemented through an iterative conversation with opencode, an AI-powered CLI tool for software engineering. The process followed the [SpeckIt](https://opencode.ai/docs/workflows/speckit) workflow:

1. **Specification** — A user description was expanded into a full feature specification (`spec.md`) through clarifying questions
2. **Planning** — The specification was analyzed for feasibility, a data model was designed, and an implementation plan was created
3. **Implementation** — opencode generated both the backend and frontend code, then refined it through build-test cycles
4. **Reimplementation** — The frontend was later modernized to use Angular 22 signal forms and control flow syntax

The complete specification artifacts in `specs/001-user-crud-demo/` document every design decision, requirement, and implementation detail — demonstrating how opencode can take a vague idea and produce a production-quality full-stack application.
