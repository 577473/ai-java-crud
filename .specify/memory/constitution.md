<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 (unversioned template) → 1.0.0
  Modified principles: N/A (all new - initial constitution)
  Added sections:
    - I. Code Simplicity & Readability
    - II. Domain-Driven Grouping
    - III. Security First
    - IV. Documentation Discipline
    - V. Dependency Integrity
    - Security & Configuration Standards
    - Architecture & Scalability
    - Governance (filled with concrete rules)
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/constitution-template.md ✅ (constitution populated from template)
    - .specify/templates/plan-template.md ✅ (generic; no constitution-specific references changed)
    - .specify/templates/spec-template.md ✅ (no changes needed)
    - .specify/templates/tasks-template.md ✅ (no changes needed)
    - .specify/templates/checklist-template.md ✅ (no changes needed)
  Follow-up TODOs: None - all placeholders resolved
-->

# JavaCRUD Constitution

## Core Principles

### I. Code Simplicity & Readability

All code MUST be written for human readability first. Code MUST be simple, clear, and
follow consistent formatting. Complexity MUST be justified. Prefer flat structures over
deep nesting. Use descriptive names that reveal intent. Avoid clever or overly abstract
solutions when straightforward ones suffice. Every piece of logic SHOULD be
understandable without requiring mental compilation.

### II. Domain-Driven Grouping

Code MUST be organized by business domain, not by technical layers (e.g., not a flat
`controllers/`, `services/`, `models/` split at the top level). Each domain module
SHOULD contain its own models, services, repositories, and controllers. Cross-domain
communication MUST happen through well-defined interfaces. Domain boundaries MUST be
respected: no leaking of domain internals across modules.

### III. Security First (NON-NEGOTIABLE)

All code MUST prevent known security vulnerabilities as defined by the OWASP Top 10.
Input validation, output encoding, authentication, authorization, and secure data
handling are REQUIRED on every endpoint. Parameterized queries MUST be used to prevent
SQL injection. Secrets MUST NEVER be hardcoded. Security review is REQUIRED for any
code handling user input, authentication, or sensitive data.

### IV. Documentation Discipline

Every public class, interface, and method MUST have documentation explaining its
purpose, parameters, return values, and exceptions thrown. Documentation MUST be kept
in sync with code changes. Self-documenting code (clear names, simple logic) is
encouraged but does NOT replace explicit documentation for the public API surface.
Internal/private methods SHOULD be documented when their logic is non-trivial.

### V. Dependency Integrity

MUST use known, reliable, well-established standard libraries. Dependencies less than
one week old MUST NOT be installed. Dependencies MUST NOT be installed without
explicit approval. Prefer standard library solutions over third-party dependencies.
Every dependency SHOULD have a clear, justified purpose. Dependency version upgrades
MUST be evaluated for breaking changes and security implications.

## Security & Configuration Standards

`.env` files or any files containing secrets MUST NEVER be committed to the repository.
All sensitive configuration MUST use environment variables or a secure secrets manager.
Secrets MUST be excluded via `.gitignore`. Configuration SHOULD be externalized from
application code. Each environment (dev, staging, production) MUST have its own
configuration path. Access credentials, API keys, tokens, and database connection
strings MUST be treated as secrets.

## Architecture & Scalability

Architecture MUST be scalable and uncoupled. Components MUST communicate through
well-defined interfaces (contracts). Loose coupling between modules is REQUIRED.
Prefer composition over inheritance. Each domain module MUST be independently testable
and, where feasible, independently deployable. The system SHOULD support horizontal
scaling of individual components. State MUST be managed explicitly; stateless services
are preferred for horizontal scalability.

## Governance

This Constitution supersedes all other development practices. Amendments require
documentation of the change, rationale, team approval, and a migration plan when
applicable. All PRs MUST verify compliance with this Constitution. Complexity or
deviations MUST be justified in the PR description. Version follows Semantic
Versioning (MAJOR.Minor.PATCH):
- MAJOR: Backward-incompatible governance changes, principle removals/redefinitions.
- MINOR: New principle or materially expanded guidance.
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
Periodic compliance reviews SHOULD be conducted as part of the development cycle.

**Version**: 1.0.0 | **Ratified**: 2026-06-25 | **Last Amended**: 2026-06-25
