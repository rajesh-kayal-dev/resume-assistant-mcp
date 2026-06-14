# Security Policy

## Reporting a Vulnerability

This project runs as an MCP server that processes user resumes and scrapes job descriptions from public URLs. While it does not handle authentication or store sensitive data on a server, we still take security seriously.

If you discover a security vulnerability, please **do not** open a public issue. Instead, email the maintainer directly:

**Email**: rk6289943975@gmail.com

You should receive a response within 48 hours. If you don't, please follow up.

### What to include

- A clear description of the issue
- Steps to reproduce (if applicable)
- Potential impact
- Any suggested fix (optional)

## Scope

The following are in scope:

- The MCP server itself (src/ directory)
- Dependencies listed in package.json
- Dockerfile and deployment configurations

The following are **out of scope**:

- Vulnerabilities in third-party MCP clients or hosts
- Issues caused by misconfiguration by the end user

## Security Best Practices for Deployments

If you deploy this server (especially publicly):

1. Run behind a reverse proxy with rate limiting.
2. Set NODE_ENV=production to disable verbose dev logging.
3. Use the provided Dockerfile — it runs as a non-root user.
4. Keep dependencies updated: run 
pm audit regularly.
5. The /health endpoint is intentionally public, but the /mcp endpoint should be restricted to authorized MCP hosts.

## Dependency Audits

We use 
pm audit in CI to surface known vulnerabilities. If a critical dependency issue is found and cannot be patched immediately, it will be noted in the README and a pinned issue will track the resolution.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |