# Quickstart: User CRUD Demo

**Phase**: 1 (Design & Contracts)
**Date**: 2026-06-25

## Prerequisites

- Java 21 JDK
- Node.js 20+ with pnpm (install via `npm i -g pnpm` or your preferred method)
- Maven (or use bundled `mvnw`)
- Angular CLI 20: `pnpm add -g @angular/cli`
- IDE with Lombok annotation processing enabled (or run `mvn compile` which handles it via annotation processor)

## Setup & Run

### Backend

```bash
# From the repository root
cd backend

# Build and start Spring Boot server (port 8080)
./mvnw spring-boot:run
```

The backend starts with H2 in-memory database. Seed data (admin + 4 mock users) is loaded automatically.

### Frontend

```bash
# Open a second terminal
cd frontend

# Install dependencies
pnpm install

# Start Angular dev server with proxy to backend (port 4200)
ng serve
```

## Validation Scenarios

### Scenario 1: Login as Admin

1. Open `http://localhost:4200` in a browser
2. You should see the neon-dark login page
3. Enter username: `admin`, password: `Admin123!`
4. Click Login
5. **Expected**: Redirected to admin home page with greeting "Welcome, Admin!"
6. Navigation bar shows: Profile, User Management, Logout

### Scenario 2: View and Edit Profile

1. After login, click "Profile" in the navigation bar
2. **Expected**: Shows your user details (first name, last name, username, email)
3. Click "Edit Profile", change first name and email
4. Click Save
5. **Expected**: Success notification appears. Profile updates are reflected.

### Scenario 3: Admin User Management

1. After login as admin, click "User Management"
2. **Expected**: Table showing all 5 seeded users
3. Click "Create User", fill in all fields, submit
4. **Expected**: New user appears in the list
5. Click on a regular user, change their role to "admin", save
6. **Expected**: Role updated. That user now has admin privileges.

### Scenario 4: Regular User Authorization

1. Log out. Log in as `jdoe` / `Password123!`
2. **Expected**: Regular user home page with greeting "Welcome, John!"
3. Navigation bar shows only: Profile, Logout (no User Management)
4. Try navigating to `http://localhost:4200/admin/users`
5. **Expected**: Redirected to home with authorization error notification

### Scenario 5: Validation

1. Log in as admin
2. Go to User Management → Create User
3. Leave all fields empty and submit
4. **Expected**: Validation error notifications appear for each required field

### Scenario 6: API via Postman

1. Import `specs/001-user-crud-demo/contracts/javacrud-postman-collection.json` into Postman
2. Run "Login" request → token is auto-stored as collection variable
3. Run subsequent requests to test CRUD operations

## Default Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | Admin123! | admin |
| jdoe | Password123! | user |
| jsmith | Password123! | user |
| alex_m | Password123! | user |
| sara_c | Password123! | user |

## API Documentation

- Swagger UI (when backend is running): `http://localhost:8080/swagger-ui.html`
- Postman collection: `specs/001-user-crud-demo/contracts/javacrud-postman-collection.json`
- Full API contracts: `specs/001-user-crud-demo/contracts/api-contracts.md`
