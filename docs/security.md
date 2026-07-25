# Security

Implemented:

- JWT-protected API routes
- Password hashing
- Input validation with Pydantic
- Rate limiting middleware
- Secure response headers
- Bearer-token CSRF hardening
- Environment validation warnings
- RBAC-ready JWT role claim

Production checklist:

- Replace development secrets
- Use HTTPS-only cookies if refresh tokens are moved to cookies
- Enable PostgreSQL backups
- Add audit log writes to sensitive actions
- Add secret scanning in CI
- Rotate JWT and database credentials
