# API Contracts: User CRUD Demo

## Base URL

```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/login` require a JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Endpoints

### POST /auth/login

Authenticate with username and password. Returns a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

**Response 200 (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "username": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@javacrud.demo",
  "role": "admin"
}
```

**Response 401 (Unauthorized):**
```json
{
  "error": "Invalid username or password"
}
```

---

### GET /users/me

Get the authenticated user's own profile.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "id": 1,
  "username": "jdoe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "jdoe@example.com",
  "role": "user"
}
```

**Response 401:** Missing or invalid token.

---

### PUT /users/me

Update the authenticated user's own profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Johnathan",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "NewPass123!"
}
```

**Notes:** Username and role fields are ignored for non-admin users. Role cannot be changed by regular user. Password change requires the new password (current password verification handled server-side). Empty or invalid fields trigger validation errors.

**Response 200 (Success):**
```json
{
  "id": 1,
  "username": "jdoe",
  "firstName": "Johnathan",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "user"
}
```

**Response 400 (Validation Error):**
```json
{
  "errors": {
    "firstName": "must not be blank",
    "email": "must be a well-formed email address"
  }
}
```

---

### GET /users (Admin only)

List all users in the system.

**Headers:** `Authorization: Bearer <token>` (admin role required)

**Response 200:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@javacrud.demo",
    "role": "admin"
  },
  {
    "id": 2,
    "username": "jdoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "jdoe@example.com",
    "role": "user"
  }
]
```

**Response 403:** User does not have admin role.

---

### GET /users/{id} (Admin only)

Get a specific user by ID.

**Headers:** `Authorization: Bearer <token>` (admin role required)

**Response 200:** Single user object (same structure as list item).

**Response 404:** User not found.

---

### POST /users (Admin only)

Create a new user.

**Headers:** `Authorization: Bearer <token>` (admin role required)

**Request Body:**
```json
{
  "username": "newuser",
  "firstName": "New",
  "lastName": "User",
  "email": "newuser@example.com",
  "password": "Password123!",
  "role": "user"
}
```

**Notes:** All fields mandatory. Username must be unique. Role defaults to "user" if not provided.

**Response 201 (Created):**
```json
{
  "id": 6,
  "username": "newuser",
  "firstName": "New",
  "lastName": "User",
  "email": "newuser@example.com",
  "role": "user"
}
```

**Response 400:** Validation error (missing/invalid fields) or duplicate username.

---

### PUT /users/{id} (Admin only)

Update any user's profile (including username and role).

**Headers:** `Authorization: Bearer <token>` (admin role required)

**Request Body:**
```json
{
  "username": "newusername",
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@example.com",
  "password": "NewPass123!",
  "role": "admin"
}
```

**Notes:** Only existing admins can set role to "admin". All fields optional on update but if provided they must be valid.

**Response 200:** Updated user object.

**Response 400:** Validation error.

---

### DELETE /users/{id} (Admin only)

Delete a user by ID.

**Headers:** `Authorization: Bearer <token>` (admin role required)

**Response 204:** No content (successful deletion).

**Response 404:** User not found.

---

## Error Response Format

**Validation Errors (400):**
```json
{
  "errors": {
    "fieldName": "error message"
  }
}
```

**Authentication Errors (401):**
```json
{
  "error": "Invalid username or password"
}
```

**Authorization Errors (403):**
```json
{
  "error": "Access denied"
}
```

**Not Found (404):**
```json
{
  "error": "User not found"
}
```
