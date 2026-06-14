# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-15

### Added

- **Parse Resume Local** — extract text from PDF, DOCX, TXT, and MD files.
- **Fetch Job Description** — scrape job postings from any public URL via Jina reader.
- **Calculate ATS Match** — keyword-based scoring with matched/missing keyword lists.
- **Generate Interview Questions** — technical + HR questions based on resume vs. job gap.
- **Get Resume Improvements** — actionable suggestions (word count, action verbs, metrics).
- **Generate Cover Letter** — targeted template that references matched skills.
- **LinkedIn Profile Optimizer** — headline, summary, and general profile tips.
- **Skill Gap Analysis** — missing skills detection with a phased learning roadmap.
- **Server infrastructure** — Express + Streamable HTTP transport, health checks, graceful shutdown.
- **Dev logging** — colored, timestamped request/response logging in development mode.
- **Docker support** — multi-stage build, non-root user, Cloud Run ready.
- **MCPize deployment** — mcpize.yaml manifest for one-command deploy.
- **Testing** — unit tests (vitest) and smoke test script.

### Infrastructure

- TypeScript with strict mode, ES modules, source maps.
- In-memory TTL cache for scraped job descriptions (1 hour).
- Configurable via environment variables (PORT, NODE_ENV).