# Implementation Plan: User CRUD Demo

**Branch**: `001-user-crud-demo` | **Date**: 2026-06-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-user-crud-demo/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a dual-module Maven web application (Spring Boot backend + Angular frontend) demonstrating CRUD operations for system users. Backend exposes a REST API secured with JWT stateless authentication. Frontend provides a neon-dark themed UI with login, user list (admin), and profile editing. Uses H2 in-memory database with Spring Data JPA, designed to be swappable to another relational database via configuration.

## Technical Context

**Language/Version**: Java 21 (backend) / TypeScript with Angular 20 (frontend)

**Primary Dependencies**: Spring Boot 3.x, Spring Data JPA, Spring Security, H2 Database, jjwt (Java JWT library), Lombok, Angular 20, Angular CLI

**Storage**: H2 in-memory database (swappable to PostgreSQL/MySQL via Spring profile configuration)

**Testing**: JUnit 5 + Mockito (backend unit/integration), Jasmine + Karma (frontend unit), Angular testing utilities

**Target Platform**: Local development server (backend :8080, frontend :4200 with proxy to backend)

**Project Type**: Web application (Spring Boot REST API + Angular SPA)

**Performance Goals**: < 3s login, < 2s profile load, < 1s save operations (local demo)

**Constraints**: Stateless JWT auth, H2 with Spring JPA abstraction, in-memory seed data on startup, neon dark theme

**Scale/Scope**: Demo application — single-user admin management, handful of pre-seeded users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| I. Simplicity & Readability | ✅ PASS | Flat project structure, domain-organized modules, clear naming |
| II. Domain-Driven Grouping | ✅ PASS | Single "User" domain with self-contained model/repo/service/controller |
| III. Security First | ✅ PASS | JWT auth, password hashing, input validation, role-based authorization |
| IV. Documentation Discipline | ✅ PASS | OpenAPI/Swagger docs via springdoc, Postman collection, Javadoc on public API |
| V. Dependency Integrity | ✅ PASS | Well-established libraries (Spring Boot, H2, jjwt, Angular) |
| Security & Configuration | ✅ PASS | JWT secret externalized, no .env committed, secrets through config |
| Architecture & Scalability | ✅ PASS | Stateless REST, decoupled frontend/backend, swappable DB via config |

**No violations.** All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-crud-demo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contract docs + Postman collection)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/javacrud/
│   │   │   ├── config/          # Security, JWT, CORS config
│   │   │   ├── user/
│   │   │   │   ├── User.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── UserDto.java
│   │   │   │   └── UserMapper.java
│   │   │   ├── auth/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── LoginResponse.java
│   │   │   ├── common/
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── seed/
│   │   │       └── DataSeeder.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-h2.yml
│   │       └── application-postgres.yml
│   └── test/
│       └── java/com/javacrud/
│           ├── user/
│           │   ├── UserControllerTest.java
│           │   └── UserServiceTest.java
│           └── auth/
│               ├── AuthControllerTest.java
│               └── JwtTokenProviderTest.java
└── pom.xml

frontend/
├── src/
│   ├── app/
│   │   ├── login/               # Login page component
│   │   ├── home/                # Home page with greeting
│   │   ├── profile/             # Profile view/edit page
│   │   ├── admin/               # Admin user management page
│   │   ├── user-list/           # Reusable user table component
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── user.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts
│   │   ├── models/
│   │   │   └── user.model.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── styles.css               # Neon dark theme global styles
│   ├── index.html
│   └── proxy.conf.json          # Proxy to backend :8080
└── angular.json
```

**Structure Decision**: Web application with separate `backend/` and `frontend/` directories. Backend follows Spring Boot conventions with domain-organized packages (user, auth, config, seed). Frontend uses Angular module structure with feature-based pages and shared services. Number of frontend files minimized by keeping reusable logic (interceptors, guards, models) as singletons rather than per-feature copies.

## Implementation Conventions

### Lombok

- Use `@Data`, `@Builder`, `@AllArgsConstructor`, `@NoArgsConstructor` on entity and DTO classes
- Use `@Slf4j` on service and controller classes for logging
- Add `lombok` as `provided` scope dependency with annotation processor in `pom.xml`

### Dependency Injection

- Favor Spring constructor injection over field injection
- Use `@RequiredArgsConstructor` (Lombok) to auto-generate constructor for `final` fields
- Explicit `@Autowired` on constructors is optional (Spring auto-wires single-constructor beans)

### Default Interface Implementation Comments

- On repository declarations extending `JpaRepository`, add a comment:
  `// Default implementation provided by Spring Data JPA`
- On any other interface where Spring auto-provides the implementation (e.g., `PasswordEncoder`), add a similar clarifying comment at the declaration site

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. No complexity justification required.
