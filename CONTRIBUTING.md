# Contributing to Resume Assistant MCP

First off, thank you for considering contributing. I maintain this project in my spare time, and every bit of help is genuinely appreciated.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Conventions](#coding-conventions)
- [Testing](#testing)
- [Questions?](#questions)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Open an [issue](https://github.com/rajesh-kayal-dev/resume-assistant-mcp/issues) and include:

- A clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

### Suggesting Features

Open an issue with the label enhancement. Describe what you want to do and why. Feature requests that include a use case and a rough sketch of the implementation tend to get accepted faster.

### Adding a New MCP Tool

1. Create src/tools/your-tool-name.ts — export a pure async function and a Zod schema.
2. Import and register it in src/index.ts via server.registerTool(...).
3. Add tests under 	ests/.
4. Document the tool in the README's [API Reference](#api-reference).

### Documentation

Typo fixes, clearer wording, and better examples are always welcome. No change is too small.

## Development Setup

`ash
# Fork and clone the repo
git clone https://github.com/your-username/resume-assistant-mcp.git
cd resume-assistant-mcp

# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Run tests
npm test
`

The server starts at http://localhost:8080/mcp.

## Pull Request Guidelines

1. Keep PRs focused on a single concern. If you have multiple unrelated changes, open separate PRs.
2. Rebase on the latest main before opening.
3. Write a clear PR description explaining **what** and **why**.
4. Ensure all existing tests pass. Add tests for new functionality.
5. Run 
pm run build to verify compilation.
6. Keep the diff minimal — don't reformat unrelated code.

## Coding Conventions

- **TypeScript** with strict mode enabled.
- Use **ES modules** (import/export).
- **Async/await** for all asynchronous code.
- Use **Zod** schemas for tool input validation.
- Tool functions should be **pure** — no MCP SDK dependency.
- Return both content (for LLM visibility) and structuredContent (for programmatic use).
- Use **kebab-case** for tool names (e.g., calculate_ats_match).
- Add .describe() calls to every Zod schema field.

### Project Structure

`
src/
+-- index.ts           # MCP server setup, Express, tool registration
+-- lib/
¦   +-- api-client.ts  # HTTP client for job description scraping
¦   +-- cache.ts       # In-memory TTL cache
+-- tools/
    +-- calculate-ats-match.ts
    +-- fetch-job-description.ts
    +-- generate-cover-letter.ts
    +-- generate-interview-questions.ts
    +-- get-resume-improvements.ts
    +-- linkedin-profile-optimizer.ts
    +-- parse-resume-local.ts
    +-- skill-gap-analysis.ts
`

## Testing

`ash
npm test              # Unit tests (vitest)
npm run test:smoke    # Smoke test (server must be running)
`

We use [vitest](https://vitest.dev/). New code should include tests that cover:

- Happy path
- Edge cases (empty input, missing files, etc.)
- Boundary conditions

## Questions?

Open a [Discussion](https://github.com/rajesh-kayal-dev/resume-assistant-mcp/discussions) or reach out via the issue tracker.