# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**typefs-registry** is an npm package containing shared type definitions and interfaces for the TypeFS ecosystem. It defines the configuration schemas and abstract base classes used across all TypeFS packages and disk drivers.

## Key Architecture

The repository exports two main categories:

1. **Configuration Types** (`lib/config.ts`): Type definitions for disk configurations
   - `DriverType`: Union type of supported storage drivers (file, s3, http, memory, null, ftp, sftp, migrate)
   - `DiskConfiguration`: Union type combining base `Disk` interface with specific driver configs
   - `Configuration`: The top-level config schema with `default` disk and `disks` record
   - Specific disk interfaces: `FileDisk`, `S3Disk`, `HttpDisk`, `MemoryDisk`, `NullDisk`

2. **Driver Interface** (`lib/drivers/disk-driver.ts`): Abstract base class that all disk drivers implement
   - `DiskDriver`: Abstract class defining the contract for all driver implementations
   - Methods: `read()`, `readStream()`, `write()`, `writeStream()`, `deleteFile()`, `deleteDirectory()`, `createDirectory()`, `listContents()`, `exists()`, `lastModified()`, `fileSize()`, `move()`, `copy()`
   - `ListDirectoryOptions`: Options for `listContents()` method

3. **Utilities** (`lib/drivers/util.ts`): Path handling for jail (sandboxing)
   - `Util.jail()`: Validates paths don't escape root directory when jail is enabled
   - `Util.rootPath()`: Resolves paths relative to root
   - `Util.isPathInsideRoot()`: Path validation helper

## Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript to dist/
npm run build

# Clean build artifacts
npm run clean

# Watch mode (recompile on file changes)
npm run watch

# Run all tests
npm test

# Run tests in watch mode
npm run mocha -- --watch

# Lint code
npm run lint

# Fix linting issues automatically
npm run fix

# Generate coverage report
npm run coverage

# Run all PR checks (build, lint, test)
npm run pr

# Security audit
npm run audit
```

### Running Specific Tests

Tests are located in `test/` directory and use Mocha:

```bash
# Run a specific test file
npm run mocha test/util.test.ts

# Run tests matching a pattern
npm run mocha test/*.test.ts --grep "pattern"
```

## Code Style & Linting

- **Linter**: ESLint with TypeScript support
- **Base config**: airbnb-base
- **Additional plugins**: sonarjs, mocha, jsdoc
- **Key rules**:
  - No console logs (except in tests via mocha)
  - Require JSDoc comments with param descriptions
  - No default exports (prefer named exports)
  - Strict TypeScript checking enabled in tsconfig.json

The project uses consistent file extensions (ignores `.d.ts` and `.js` files in linting).

## Project Structure

```
lib/
  index.ts                 # Main entry point (re-exports config and drivers)
  config.ts               # Configuration type definitions
  drivers/
    index.ts              # Re-exports disk-driver and util
    disk-driver.ts        # Abstract DiskDriver base class
    util.ts               # Path utility functions (Util class)

test/
  util.test.ts            # Tests for Util path handling

dist/                     # Build output (generated, not in repo)
  *.js, *.d.ts            # Compiled JavaScript and type definitions
```

## Important Notes

- This is a **type-only/interface package** - it defines contracts but contains no concrete driver implementations
- Actual driver implementations (file, S3, etc.) live in separate packages that depend on this registry
- The `jail` configuration parameter is critical for security: when true, it prevents directory traversal attacks by restricting paths to the configured root
- All async driver methods are promises that should throw errors when `jail: true` and paths attempt to escape root
- The package targets ES5 with CommonJS modules for broad compatibility

## Testing

- Uses **Mocha** test runner with TypeScript support via ts-node
- Uses **Chai** for assertions
- Uses **Sinon** for mocking/stubbing
- Uses **mock-fs** for filesystem mocking
- Test configuration in `.mocharc.json` watches `src/**` and `test/**` files

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on pushes to:
- main branch
- Feature branches: patch/*, minor/*, major/*, feature/*, renovate/*

It tests across:
- Node.js 16.x and 18.x
- Ubuntu, Windows, and macOS

Steps: dependency install → security audit → lint → build → test
