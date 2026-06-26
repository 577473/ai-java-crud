# Research: User CRUD Demo

**Phase**: 0 (Outline & Research)
**Date**: 2026-06-25

## Technology Decisions

### Backend: Java 21 + Spring Boot 3.x

- **Decision**: Spring Boot 3.3+ with Java 21
- **Rationale**: Directly specified by user. Spring Boot 3.x provides auto-configuration, embedded server, and seamless JPA/security integration. Java 21 offers latest LTS features.
- **Alternatives considered**: None (user-specified).

### In-Memory Database: H2 via Spring Data JPA

- **Decision**: H2 in-memory with Spring JPA + Hibernate abstraction layer
- **Rationale**: User-specified H2 for demo. Spring Data JPA provides dialect abstraction so switching to PostgreSQL/MySQL requires only a profile change and a new driver dependency.
- **Alternatives considered**: None (user-specified).

### Authentication: JWT (Stateless)

- **Decision**: JSON Web Tokens using jjwt (io.jsonwebtoken) library, stateless session management. Access token expires in 5 minutes. Refresh token expires in 30 minutes and is rotated on each refresh.
- **Rationale**: User-specified JWT. Short-lived access tokens (5 min) limit breach impact. Refresh tokens (30 min) allow seamless re-authentication without re-entering credentials. Rotation prevents replay of stolen refresh tokens.
- **Alternatives considered**: OAuth2 (overkill for demo), session-based auth (defeats stateless goal).

### Frontend: Angular 20

- **Decision**: Angular 20 with standalone components, modular routing, reusable templates
- **Rationale**: User-specified Angular 20. Minimizes file count by reusing single interceptor, guard, and service classes across all features.
- **Alternatives considered**: None (user-specified).

### API Documentation: OpenAPI/Swagger + Postman Collection

- **Decision**: springdoc-openapi for auto-generated Swagger UI, plus a manually maintained Postman collection JSON export
- **Rationale**: Provides both interactive documentation (Swagger) and an importable file for Postman testing.
- **Alternatives considered**: RAML, API Blueprint (less ecosystem support).

### Build Tool: Maven

- **Decision**: Maven with pom.xml and mvnw wrapper
- **Rationale**: User-specified Maven. Industry standard for Spring Boot projects.
- **Alternatives considered**: Gradle (not specified by user).

### Code Generation: Lombok

- **Decision**: Use Lombok annotations (`@Data`, `@Builder`, `@AllArgsConstructor`, `@NoArgsConstructor`, `@Slf4j`) on entity, DTO, and service classes
- **Rationale**: User-specified. Eliminates boilerplate (getters, setters, constructors, loggers) while keeping code readable. Supported via Maven annotation processor.
- **Alternatives considered**: Manual boilerplate (verbose, error-prone); Java records (not suitable for JPA entities).

### Dependency Injection: Spring

- **Decision**: Use Spring constructor injection (`@RequiredArgsConstructor` or explicit constructor DI) for all services and components
- **Rationale**: User-specified. Spring idiom promotes loose coupling and testability. Constructor injection is the Spring-recommended approach over field injection.
- **Alternatives considered**: Field injection with `@Autowired` (less testable); manual DI (defeats framework purpose).

### Default Interface Comments

- **Decision**: Add a `// Default implementation provided by Spring Data JPA` comment on `UserRepository extends JpaRepository` and similar auto-configured declarations
- **Rationale**: User-specified. Clarifies that the framework provides the default implementation behind the interface, aiding developer understanding.

### Validation: Jakarta Bean Validation (JSR-380)

- **Decision**: Use `@Valid` + annotations (`@NotBlank`, `@Email`, `@Size`) on DTOs
- **Rationale**: Standard Spring Boot validation. Catches invalid state before service layer as required by FR-017.
- **Alternatives considered**: Manual validation in service layer (redundant with JSR).

### Frontend Testing: Jasmine + Karma

- **Decision**: Angular default testing stack (Jasmine + Karma + TestBed)
- **Rationale**: Angular 20 ships with these. Minimal setup overhead.
- **Alternatives considered**: Cypress (E2E overkill for demo), Jest (requires config changes).

## Security Considerations

- Passwords stored as BCrypt hashes (Spring Security's built-in PasswordEncoder)
- JWT signed with HMAC-SHA256 using a configurable secret
- JWT expiration: 24 hours (reasonable for demo)
- Endpoint authorization:
  - `POST /api/auth/login` — public
  - `GET /api/users/me` — authenticated (any role)
  - `PUT /api/users/me` — authenticated (any role)
  - `GET /api/users` — ADMIN only
  - `GET /api/users/{id}` — ADMIN only
  - `POST /api/users` — ADMIN only
  - `PUT /api/users/{id}` — ADMIN only
  - `DELETE /api/users/{id}` — ADMIN only

## Database Migration Strategy

- H2 runs in-memory for dev/demo. Spring Boot auto-creates schema from JPA entities.
- For PostgreSQL/MySQL: switch Spring profile, add JDBC driver, Spring Boot auto-configures dialect.
- Schema is initialized via `spring.jpa.hibernate.ddl-auto=update` — creates tables if absent, never drops existing data.
- Seed data loaded via `CommandLineRunner` in `DataSeeder` on startup. Seed step runs only if the user table is empty (idempotent).
