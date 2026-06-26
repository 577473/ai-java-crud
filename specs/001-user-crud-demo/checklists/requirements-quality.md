# Requirements Quality Checklist: User CRUD Demo

**Purpose**: Unit-test the spec's requirements for completeness, clarity, consistency, and measurability
**Created**: 2026-06-25
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 Are requirements defined for session expiration timeout duration? [Gap, Spec §FR-016 — states "session expiration" but no timeout value]
- [x] CHK002 Are password change requirements specified (current password verification before allowing change)? [Gap, Spec §FR-006 — allows password update without confirmation requirement]
- [x] CHK003 Are requirements defined for the admin user management page layout and CRUD workflow? [Completeness, Gap]
- [x] CHK004 Are requirements specified for handling JWT token expiry mid-session (graceful redirect or refresh)? [Gap, Spec §FR-016 — mentions termination but not mid-session handling]
- [x] CHK005 Is the username uniqueness constraint explicitly stated as a functional requirement? [Completeness, Spec §FR-017 — implied in validation but not as a separate FR]
- [x] CHK006 Are requirements defined for what data the navigation bar displays for each role (admin vs. regular user)? [Completeness, Spec §FR-004 — says "links to profile and logout" but differs by role]
- [x] CHK007 Are requirements specified for the home page content beyond the greeting (what does the user see/do)? [Completeness, Gap]

## Requirement Clarity

- [x] CHK008 Is "neon dark theme" defined with specific color values or a reference palette? [Clarity, Spec §FR-013 — "dark background and bright accent colors" is subjective]
- [x] CHK009 Is "several default regular users" quantified to an exact number? [Clarity, Spec §FR-011 — "several" is ambiguous]
- [x] CHK010 Is the format, position, and dismiss behavior of in-page notifications specified? [Clarity, Spec §FR-014 — "toast-style" narrows but doesn't specify behavior]
- [x] CHK011 Is "documented credentials" for the admin account defined (where/how documented)? [Clarity, Spec §FR-010 — says "documented credentials" but not where]
- [x] CHK012 Is the logout button's position and appearance in the navigation bar specified? [Clarity, Spec §FR-004]
- [x] CHK013 Is "regular user" formally distinguished from "administrator" with a role enum definition in requirements? [Clarity, Spec §Key Entities — defined in entity but not in FRs as enum values]

## Requirement Consistency

- [x] CHK014 Do FR-006 (user can update email) and FR-008 (prevent modifying others' data) have consistent scope boundaries? [Consistency, Spec — both reference "update" but via different paths]
- [x] CHK015 Are navigation bar requirements consistent between admin view (FR-009 implies user management link) and regular user view (FR-004 only mentions profile + logout)? [Consistency, Spec §FR-004 + FR-009]
- [x] CHK016 Do acceptance scenario 6 in US1 (admin promotes user to admin) and scenario 7 (user self-promotion rejected) both map to FR-009's role constraint? [Consistency, Spec §US1 + FR-009]
- [x] CHK017 Is the field edit distinction (FR-006 vs FR-007 vs role restriction) consistently applied across all user stories? [Consistency, Spec §US1, US2, US3]

## Acceptance Criteria Quality

- [x] CHK018 Can "under 3 seconds" (SC-001) for login be objectively measured in any environment without specialized tooling? [Measurability, Spec §SC-001]
- [x] CHK019 Can "admin full CRUD cycle in under 30 seconds" (SC-004) be verified without a stopwatch dependency? [Measurability, Spec §SC-004]
- [x] CHK020 Is the "5-second window" in SC-006 a requirement for the UI layer, the API layer, or both? [Measurability, Spec §SC-006]
- [x] CHK021 Is "within 1 second" (SC-005) for notification appearance testable across varying network/environment conditions? [Measurability, Spec §SC-005]

## Scenario Coverage

- [x] CHK022 Are requirements defined for password storage mechanism (hashing algorithm, salt policy)? [Coverage, Gap — mentioned in Assumptions but absent from FRs]
- [x] CHK023 Are requirements defined for the registration/provisioning path of new users beyond seeding and admin creation? [Coverage, Gap — spec assumes no self-registration]
- [x] CHK024 Are concurrent session management requirements defined (single session per user vs. multiple allowed)? [Coverage, Gap]
- [x] CHK025 Are requirements defined for the eventual switch from H2 to PostgreSQL/MySQL (migration scripts, data preservation)? [Coverage, Spec §FR-012 — "designed to allow switching" but no migration requirements]

## Edge Case Coverage

- [x] CHK026 Are requirements defined for handling database initialization failure (seed data load failure)? [Edge Case, Gap]
- [x] CHK027 Are requirements defined for handling JWT token tampering or invalid signature? [Edge Case, Gap — implied by security but not in requirements]
- [x] CHK028 Are requirements defined for the scenario where admin creates a user with a duplicate email (non-unique field)? [Edge Case, Spec — duplicate username covered in Edge Cases but email uniqueness not addressed]
- [x] CHK029 Are requirements defined for handling form submission network timeout (request in-flight for > 30s)? [Edge Case, Gap]

## Non-Functional Requirements

- [x] CHK030 Are the performance targets (SC-001 through SC-007) stated as requirements rather than aspirational goals? [Non-Functional, Spec §SC — in Success Criteria, not in FRs]
- [x] CHK031 Are accessibility requirements defined for any interactive element (keyboard navigation, screen readers, contrast)? [Non-Functional, Gap — neon dark theme may have contrast implications]
- [x] CHK032 Are requirements for the number of concurrent users supported explicitly stated? [Non-Functional, Gap — demo app, but implied by "scalability" principle]

## Dependencies & Assumptions

- [x] CHK033 Is the dependency on Java 21, Maven, and Node.js documented as project prerequisites in the spec? [Dependency, Gap — noted in plan.md and quickstart.md but not in spec]
- [x] CHK034 Is the "no email verification" exclusion stated as an explicit out-of-scope declaration in the requirements section? [Assumption, Spec §Assumptions — present as assumption, not as formal out-of-scope]
- [x] CHK035 Are the field-level validation rules (char limits, patterns) documented as requirements or only as assumptions? [Assumption, Spec §Assumptions — last bullet, not in FRs]
