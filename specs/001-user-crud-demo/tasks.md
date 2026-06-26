---

description: "Task list for User CRUD Demo feature implementation"

---

# Tasks: User CRUD Demo

**Input**: Design documents from `specs/001-user-crud-demo/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included for each user story (backend unit + integration tests required per constitution).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `backend/` and `frontend/` at repository root
- Backend base: `backend/src/main/java/com/javacrud/`
- Frontend base: `frontend/src/app/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend Maven project structure and pom.xml with Spring Boot 3.x, Spring Data JPA, Spring Security, H2, jjwt, Lombok, springdoc-openapi, and validation dependencies at `backend/pom.xml`
- [X] T002 [P] Create frontend Angular 20 project with pnpm and Angular CLI at `frontend/` — run `pnpm dlx @angular/cli new frontend --package-manager=pnpm --routing --style=css`, then add proxy.conf.json pointing to `http://localhost:8080/api`
- [X] T003 [P] Create `.mvn/` wrapper and `mvnw`/`mvnw.cmd` scripts in `backend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [X] T004 [P] Create User JPA entity with Lombok (`@Entity`, `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`) and Jakarta validation annotations in `backend/src/main/java/com/javacrud/user/User.java`
- [X] T005 [P] Create UserRepository extending JpaRepository in `backend/src/main/java/com/javacrud/user/UserRepository.java` — add comment `// Default implementation provided by Spring Data JPA`
- [X] T006 [P] Create UserDto (record or class with validation annotations) and UserMapper (BeanUtils or MapStruct) in `backend/src/main/java/com/javacrud/user/UserDto.java` and `backend/src/main/java/com/javacrud/user/UserMapper.java`
- [X] T007 [P] Create JwtTokenProvider for generating/validating access tokens (5-min expiry) and refresh tokens (30-min expiry), with HMAC-SHA256 signing, in `backend/src/main/java/com/javacrud/auth/JwtTokenProvider.java`
- [X] T008 [P] Create LoginRequest, LoginResponse, and RefreshTokenRequest DTOs in `backend/src/main/java/com/javacrud/auth/`
- [X] T009 Create AuthService with login (validate credentials, issue JWT pair) and token-refresh (validate refresh token, rotate, issue new pair) methods in `backend/src/main/java/com/javacrud/auth/AuthService.java`
- [X] T010 [P] Create CorsConfig/WebConfig allowing `http://localhost:4200` origin in `backend/src/main/java/com/javacrud/config/WebConfig.java`
- [X] T011 [P] Create GlobalExceptionHandler with `@RestControllerAdvice` covering validation errors, authentication errors, authorization errors, and not-found in `backend/src/main/java/com/javacrud/common/GlobalExceptionHandler.java`
- [X] T012 Create JwtAuthenticationFilter (extends OncePerRequestFilter) extracting and validating JWT from Authorization header, setting SecurityContext, in `backend/src/main/java/com/javacrud/config/JwtAuthenticationFilter.java`
- [X] T013 Create SecurityConfig with SecurityFilterChain — configure permitAll for `/api/auth/login`, authenticated for `/api/users/me`, admin-only for `/api/users/**` (excluding `/api/users/me`), in `backend/src/main/java/com/javacrud/config/SecurityConfig.java`
- [X] T014 [P] Create `application.yml` with JWT secret, CORS settings, and Spring Data JPA ddl-auto=update in `backend/src/main/resources/application.yml`
- [X] T015 [P] Create `application-h2.yml` with H2 connection details, console enabled, and ddl-auto=update in `backend/src/main/resources/application-h2.yml`
- [X] T016 [P] Create `application-postgres.yml` as a template for PostgreSQL switching in `backend/src/main/resources/application-postgres.yml`
- [X] T017 Create DataSeeder implementing CommandLineRunner — seed admin account (admin/Admin123!/admin) and 5 mock users, skip if users exist, in `backend/src/main/java/com/javacrud/seed/DataSeeder.java`

### Frontend Foundation

- [X] T018 [P] Create user.model.ts (TypeScript interface) with id, username, firstName, lastName, email, role in `frontend/src/app/models/user.model.ts`
- [X] T019 [P] Create token.service.ts for storing/retrieving JWT and refresh tokens in localStorage in `frontend/src/app/services/token.service.ts`
- [X] T020 Create auth.service.ts with login, refreshToken, logout, isLoggedIn, isAdmin methods using HttpClient in `frontend/src/app/services/auth.service.ts`
- [X] T021 [P] Create jwt.interceptor.ts attaching Bearer token to all requests in `frontend/src/app/interceptors/jwt.interceptor.ts`
- [X] T022 [P] Create error.interceptor.ts catching 401 errors and redirecting to login in `frontend/src/app/interceptors/error.interceptor.ts`
- [X] T023 [P] Create auth.guard.ts protecting routes — redirect to login if unauthenticated in `frontend/src/app/guards/auth.guard.ts`
- [X] T024 [P] Create admin.guard.ts protecting admin-only routes — redirect if not admin in `frontend/src/app/guards/admin.guard.ts`
- [X] T025 Create app.module.ts importing HttpClientModule, RouterModule, FormsModule, ReactiveFormsModule, and providing interceptors in `frontend/src/app/app.module.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Admin Login and User Management (Priority: P1) 🎯 MVP

**Goal**: As an administrator, I want to log in and manage all user accounts (create, read, update, delete any user).

**Independent Test**: Log in with admin credentials, navigate to user management, create/modify/delete users, verify changes persist and authorization rules apply.

### Tests for User Story 1

- [X] T026 [P] [US1] Create AuthControllerTest for login success, login failure, and token refresh endpoints in `backend/src/test/java/com/javacrud/auth/AuthControllerTest.java`
- [X] T027 [P] [US1] Create UserControllerTest for admin CRUD — list, get by id, create, update, delete — with role-based authorization checks in `backend/src/test/java/com/javacrud/user/UserControllerTest.java`
- [X] T028 [P] [US1] Create UserServiceTest for create/update/delete logic and validation in `backend/src/test/java/com/javacrud/user/UserServiceTest.java`
- [X] T029 [P] [US1] Create JwtTokenProviderTest for token generation, validation, and expiry in `backend/src/test/java/com/javacrud/auth/JwtTokenProviderTest.java`

### Backend Implementation for User Story 1

- [X] T030 [US1] Create UserService with CRUD methods, duplicate-username/email checks, role-change authorization (only admin can set role to "admin"), and current-password verification in `backend/src/main/java/com/javacrud/user/UserService.java`
- [X] T031 [US1] Create UserController with endpoints: `GET /users` (list), `GET /users/{id}` (get by id), `POST /users` (create), `PUT /users/{id}` (update), `DELETE /users/{id}` (delete) — all admin-only, with `@Valid` validation, in `backend/src/main/java/com/javacrud/user/UserController.java`
- [X] T032 [US1] Create AuthController with `POST /auth/login` and `POST /auth/refresh` endpoints in `backend/src/main/java/com/javacrud/auth/AuthController.java`

### Frontend Implementation for User Story 1

- [X] T033 [P] [US1] Create login component with neon-dark themed form, validation error display, submit-button disable during request, in `frontend/src/app/login/`
- [X] T034 [P] [US1] Create admin component with user list table (reusable user-list component), create/edit modal form, delete confirmation, in `frontend/src/app/admin/`
- [X] T035 [P] [US1] Create user-list reusable component for displaying users in a table (accepts users array as input, emits row actions) in `frontend/src/app/user-list/`
- [X] T036 [P] [US1] Create user.service.ts with getUsers, getUserById, createUser, updateUser, deleteUser methods in `frontend/src/app/services/user.service.ts`
- [X] T037 [US1] Create app-routing.module.ts with routes: `login`, `home` (auth-guard), `profile` (auth-guard), `admin` (admin-guard), default redirect to login in `frontend/src/app/app-routing.module.ts`
- [X] T038 [US1] Update app.component.html with `<router-outlet>` and conditionally show navigation bar when authenticated in `frontend/src/app/app.component.html`

**Checkpoint**: At this point, User Story 1 should be fully functional — admin can log in, see user list, and perform CRUD operations.

---

## Phase 4: User Story 2 - Regular User Login and Profile View (Priority: P1)

**Goal**: As a regular user, I want to log in and view my own profile.

**Independent Test**: Log in with a regular user account, verify the home page greeting, navigate to profile page and confirm all fields display correctly. Verify unauthorized access to `/api/users` is rejected.

### Tests for User Story 2

- [X] T039 [P] [US2] Create test for regular user login and profile GET in `backend/src/test/java/com/javacrud/user/UserControllerTest.java` (append to existing)
- [X] T040 [P] [US2] Create frontend component tests for login and home components in `frontend/src/app/login/` and `frontend/src/app/home/`

### Backend Implementation for User Story 2

- [X] T041 [US2] Add `GET /users/me` endpoint to UserController — returns authenticated user's profile, rejects regular users trying to access other users' data in `backend/src/main/java/com/javacrud/user/UserController.java`

### Frontend Implementation for User Story 2

- [X] T042 [P] [US2] Create home component with personalized greeting ("Welcome, {firstName}!") and navigation bar with links to Profile and Logout in `frontend/src/app/home/`
- [X] T043 [US2] Create profile component displaying user details (firstName, lastName, username, email) read from `GET /users/me` in `frontend/src/app/profile/`

**Checkpoint**: Regular users can log in, see their profile, and are blocked from admin-only endpoints.

---

## Phase 5: User Story 3 - Regular User Profile Editing (Priority: P2)

**Goal**: As a regular user, I want to edit my own profile details (except username and role).

**Independent Test**: Log in as regular user, edit first name/last name/email, save, confirm persistence. Try changing username (rejected). Change password with incorrect current password (rejected).

### Tests for User Story 3

- [X] T044 [P] [US3] Create test for profile update endpoint — edit allowed fields, reject username change, require current password for password change in `backend/src/test/java/com/javacrud/user/UserControllerTest.java`

### Backend Implementation for User Story 3

- [X] T045 [US3] Add `PUT /users/me` endpoint to UserController — validates current password for password changes, rejects username/role modification for regular users in `backend/src/main/java/com/javacrud/user/UserController.java`
- [X] T046 [US3] Add updateOwnProfile method to UserService — only updates allowed fields (firstName, lastName, email, password), ignores username/role for regular users, validates current password before password change in `backend/src/main/java/com/javacrud/user/UserService.java`

### Frontend Implementation for User Story 3

- [X] T047 [US3] Add edit mode to profile component — inline editing of firstName, lastName, email, password (with current-password field), submit-button disable during request, validation error notifications, in `frontend/src/app/profile/`
- [X] T048 [US3] Implement duplicate-submission prevention on profile edit form — disable button on submit, ignore subsequent clicks until response, in `frontend/src/app/profile/`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T049 [P] Create global `styles.css` with neon dark theme — dark background (#0a0a0f), bright accents (cyan #00ffff, magenta #ff00ff), styled buttons, inputs, cards, in `frontend/src/styles.css`
- [X] T050 [P] Create toast notification component for in-page success/error/warning notifications (auto-dismiss, stackable) in `frontend/src/app/services/notification.service.ts` and `frontend/src/app/notification/`
- [X] T051 [P] Add in-site notification service integration — wrap all API calls to show toast on success/error in `frontend/src/app/services/`
- [X] T052 [P] Generate OpenAPI/Swagger documentation via springdoc-openapi in `backend/` — verify at `http://localhost:8080/swagger-ui.html`
- [X] T053 [P] Export Postman collection from `specs/001-user-crud-demo/contracts/javacrud-postman-collection.json` and verify import works
- [X] T054 Run quickstart.md validation scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 and US2 (Phase 3+4)**: Both depend on Foundational. Can be implemented in parallel.
- **US3 (Phase 5)**: Depends on US2 completion (reuses profile component)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no dependency on other stories
- **US2 (P1)**: Can start after Foundational — no dependency on other stories
- **US3 (P2)**: Depends on US2 (reuses profile component and `GET /users/me`)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- US1 and US2 can be implemented in parallel after Foundational phase
- US1 backend and frontend tasks marked [P] can run in parallel within the story
- Test tasks marked [P] within a story can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Admin CRUD)
4. **STOP and VALIDATE**: Test admin login + user management independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Admin CRUD)
   - Developer B: User Story 2 (User Login & Profile View)
3. Developer C: User Story 3 after Developer B finishes US2 profile component

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- After implementing and checking a task, add a git commit with the changes
- Stop at any checkpoint to validate story independently
