# Feature Specification: User CRUD Demo

**Feature Branch**: `001-user-crud-demo`

**Created**: 2026-06-25

**Status**: Draft

**Input**: User description: "Simple web application that demo's crud functionality for users in a system..."

## Clarifications

### Session 2026-06-25

- Q: All user fields are mandatory. User cannot save data to an invalid state. → A: All six user fields (firstName, lastName, username, email, password, role) are required and non-nullable. The system MUST validate all inputs on both client and server side before persisting. Any invalid or missing field MUST be rejected with a specific error notification identifying the field and the validation rule violated.
- Q: Only admin users can designate other users as admins. → A: Only existing users with role "admin" can change another user's role to "admin". Regular users cannot grant admin status to themselves or others.
- Q: Login token expiry and refresh token. → A: Access token expires in 5 minutes. Refresh token lasts 30 minutes. The API provides a token refresh endpoint using the refresh token.
- Q: Password change requirements. → A: Password change requires the user to be logged in and to input their current password before setting a new one.
- Q: Duplicate usernames and email. → A: The system MUST reject any create or update operation that would result in a duplicate username or duplicate email. Both fields are unique constraints.
- Q: Number of mocked users (FR-011). → A: Create exactly 5 pre-seeded regular users with mock data.
- Q: Schema initialization (FR-012). → A: Use Spring Data JPA's auto-initialization (spring.jpa.hibernate.ddl-auto) to create the database schema on startup if not present. When switching database engines, the app initializes the schema if not already present. Schema must never be deleted (ddl-auto must not use "create" or "create-drop" in production-like profiles).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Login and User Management (Priority: P1)

As an administrator, I want to log in and manage all user accounts (create, read, update, delete any user) so that I can control system access and user data.

**Why this priority**: Admin functionality is required to create and manage other users. Without it, there is no way to populate or administer the system beyond the pre-seeded accounts.

**Independent Test**: Can be tested by logging in with the default admin credentials, navigating to the user management section, and verifying full CRUD operations on any user account including creation, modification, and deletion.

**Acceptance Scenarios**:

1. **Given** the admin is on the login page, **When** they enter valid admin credentials, **Then** they are redirected to the admin home page with a personalized greeting.
2. **Given** the admin is logged in, **When** they navigate to the user list, **Then** they see all users in the system.
3. **Given** the admin is creating a new user, **When** they submit the form with one or more empty or invalid fields, **Then** the system rejects the submission and displays validation error notifications identifying each problem field.
4. **Given** the admin is creating a new user, **When** they submit the form with all fields valid and non-empty, **Then** the user is created and a success notification is displayed.
5. **Given** the admin is viewing a user's details, **When** they edit any editable field, **Then** the changes are saved and a success notification is displayed.
6. **Given** an admin is editing a regular user's profile, **When** they change the user's role from "user" to "admin" and submit, **Then** the role change is saved and the user gains admin privileges.
7. **Given** a regular user is on their profile edit page, **When** they try to change their own role to "admin", **Then** the change is rejected with an authorization error notification.
8. **Given** the admin is viewing another user's account, **When** they delete that user, **Then** the user is removed from the system and a confirmation notification is shown.

---

### User Story 2 - Regular User Login and Profile View (Priority: P1)

As a regular user, I want to log in and view my own profile so that I can see my account details.

**Why this priority**: Login and profile viewing are the most basic user-facing features. No user can interact with the system without authentication.

**Independent Test**: Can be tested by logging in with a regular user account and verifying the profile page displays the correct first name, last name, username, and email.

**Acceptance Scenarios**:

1. **Given** the user is on the login page, **When** they enter valid credentials, **Then** they are redirected to their personal home page with a greeting.
2. **Given** the user is logged in, **When** they view their profile, **Then** they see their first name, last name, username, and email.
3. **Given** the user is logged in, **When** they attempt to access another user's profile directly via URL manipulation, **Then** they receive an authorization error notification.

---

### User Story 3 - Regular User Profile Editing (Priority: P2)

As a regular user, I want to edit my own profile details so that I can keep my information current.

**Why this priority**: Profile editing is the primary self-service feature, but the system is still usable with pre-seeded data alone.

**Independent Test**: Can be tested by logging in as a regular user, modifying editable fields (first name, last name, email, password), confirming the changes persist, and verifying that username remains unchanged.

**Acceptance Scenarios**:

1. **Given** the user is on their profile edit page, **When** they change their first name, last name, or email and submit, **Then** the changes are saved and a success notification is displayed.
2. **Given** the user is on their profile edit page, **When** they clear a required field (e.g., email) and submit, **Then** the system rejects the submission and displays a validation error notification identifying the empty field.
3. **Given** the user is on their profile edit page, **When** they attempt to change their username, **Then** the change is rejected with an error notification explaining that the username cannot be changed.
4. **Given** the user submits a profile change, **When** they click the submit button multiple times rapidly, **Then** only the first submission is processed and subsequent clicks are ignored until the request completes.

---

### Edge Cases

- What happens when a user tries to log in with an incorrect password? A clear error notification should be shown without revealing whether the username exists.
- How does the system handle an expired or invalid session? The user should be redirected to the login page with an appropriate message.
- What happens when an admin deletes their own account? The action should be allowed (as admin can manage all accounts) and the admin session should be terminated.
- How does the system behave when the admin creates a user with a duplicate username? A validation error should be returned.
- How does the system behave when the admin creates a user with a duplicate email? A validation error should be returned separate from the username error.
- What happens when a regular user is deleted by an admin while the user has an active session? The user's next action should terminate their session.
- How does the system respond to an empty user list when there are no regular users?
- How does the system handle a form submission where all fields are empty? All mandatory field validation errors should be shown simultaneously.
- How does the system handle a submission with an invalid email format? A specific validation error for the email field should be shown.
- How does the system handle an admin attempt to create a user without assigning a role? The role field should default to "user" or be rejected with a validation error.
- How does the system handle a regular user attempting to change their own role to "admin"? The action must be rejected with an authorization error.
- What happens when the last remaining admin user changes their own role to "user"? The action should be allowed (or prevented with a warning that no admin would remain).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate users using username and password credentials. On successful authentication, an access token (JWT, 5-minute expiry) and a refresh token (30-minute expiry) MUST be issued.
- **FR-002**: System MUST display a login page as the default landing page for unauthenticated users.
- **FR-003**: System MUST redirect authenticated users to a personalized home page displaying a greeting with their first name. No additional content beyond the greeting and navigation bar is required on the home page.
- **FR-004**: System MUST provide a navigation bar on all authenticated pages containing links to the user's profile and logout. Administrators MUST additionally see a link to user management. The logout option MUST appear as the rightmost navigation item.
- **FR-005**: System MUST allow all authenticated users to view their own profile details (first name, last name, username, email).
- **FR-006**: System MUST allow users to update their first name, last name, and email from their profile edit page. Password changes MUST require the user to be logged in and to provide their current password before accepting a new password.
- **FR-007**: System MUST prevent users from changing their username; attempting to do so MUST return an error notification.
- **FR-008**: System MUST prevent regular users from viewing or modifying any other user's data. Attempts MUST result in an authorization error.
- **FR-009**: Administrators MUST be able to view, create, update, and delete any user account in the system. Only administrators can change a user's role to "admin".
- **FR-010**: System MUST pre-seed a default administrator account on startup with documented credentials.
- **FR-011**: System MUST pre-seed exactly 5 default regular users with mock data on startup for demonstration purposes.
- **FR-012**: System MUST use in-memory data storage by default (H2), with Spring Data JPA auto-initialization creating the schema on startup if not present. Switching to another relational database engine (e.g., PostgreSQL) through configuration MUST automatically initialize the schema if not already present. Schema MUST NEVER be deleted — ddl-auto settings that drop existing schemas ("create", "create-drop") MUST NOT be used in any profile targeting persistent storage.
- **FR-013**: System MUST render all pages in a neon dark visual theme with a dark background (hex #0a0a0f) and bright accent colors (cyan #00ffff, magenta #ff00ff) for buttons, links, and highlights.
- **FR-014**: System MUST display in-page notifications (toast-style) for all operation results including success confirmations, errors, and warnings. Notifications MUST appear in the top-right corner, auto-dismiss after 5 seconds, and stack vertically when multiple are triggered.
- **FR-015**: System MUST disable the submit button and ignore additional submission attempts while a form submission request is in progress.
- **FR-016**: System MUST terminate the user session and redirect to the login page upon explicit logout or session expiration.
- **FR-017**: System MUST validate that all required user fields (firstName, lastName, username, email, password, role) are non-empty and well-formed before any create or update operation. Invalid or missing data MUST be rejected with specific error notifications identifying each invalid field and the reason. Username and email MUST be unique — any operation creating a duplicate MUST be rejected.
- **FR-018**: System MUST provide a token refresh endpoint that accepts a valid refresh token and issues a new access token (5-minute expiry). The refresh token itself MUST remain valid for 30 minutes from issuance and MUST be rotated on each refresh request.

### Key Entities *(include if feature involves data)*

- **User**: Represents a system user with attributes: unique username (immutable), first name, last name, password (stored securely hashed), unique email address, and role (admin or regular user). All fields are mandatory and non-nullable. Both username and email are unique constraints. Only users with role "admin" can change another user's role to "admin". Regular users cannot modify their own role field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the login process and reach their home page in under 3 seconds.
- **SC-002**: Users can view their profile page within 2 seconds of navigating to it.
- **SC-003**: Profile edits are reflected immediately — changes appear within 1 second of submission confirmation.
- **SC-004**: Admin users can complete a full user CRUD cycle (view list, create, edit, delete) in under 30 seconds.
- **SC-005**: In-page notifications appear within 1 second of the triggering operation completing.
- **SC-006**: Duplicate form submissions are prevented — clicking submit multiple times within a 5-second window processes only the first click.
- **SC-007**: A first-time visitor can understand how to log in within 10 seconds of landing on the page.

## Assumptions

- Passwords must be at least 8 characters long for all users.
- Sessions are managed via JWT access token (5-min expiry) and refresh token (30-min expiry). No server-side session state is stored.
- Email verification is out of scope for this demo application.
- The neon dark theme uses a dark background (e.g., #0a0a0f range) with bright accent colors (cyan, magenta, electric blue, neon green) for buttons, links, and highlights.
- The default admin account uses credentials admin / Admin123! (or similar documented defaults) and has the role "admin".
- Mock regular users include a variety of names and roles, all with role "user".
- The in-memory database is initialized and populated with seed data on application startup.
- User passwords are never stored or transmitted in plain text. Passwords MUST be hashed using BCrypt.
- The target audience is developers and evaluators reviewing the demo — not end consumers.
- Mobile responsiveness is not required for this demo version.
- The application is served over HTTP (HTTPS not required for local demo).
- No self-registration is needed — all accounts are pre-seeded or created by admins.
- Field-level validation rules: firstName/lastName (1-100 chars, letters only), username (3-30 chars, alphanumeric + underscore), email (standard email format), password (8+ chars, at least 1 uppercase, 1 lowercase, 1 digit), role (must be "admin" or "user").
