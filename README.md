# QA Automation Framework Documentation

## Overview

This is a **Playwright-based automated test suite** for a React Todo application. The framework implements modern test architecture patterns including fixture composition, page objects, and comprehensive API testing capabilities.

| Property | Value |
|----------|-------|
| **Framework** | Playwright Test v1.58.1 |
| **Language** | TypeScript |
| **Target Application** | React Todo App |
| **Base URL** | http://localhost:3000 |

---

## Project Structure

```
qa-challenge/
├── .env                              # Environment configuration
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI/CD workflow
├── .gitignore                        # Git ignore rules
├── package.json                      # npm dependencies and scripts
├── playwright.config.ts              # Playwright test configuration
├── README.md                         # Project documentation
├── QA-AUTOMATION.md                  # This file
├── components/
│   └── index.ts                      # Base component classes
├── fixtures/
│   ├── expect.ts                     # Custom expect implementation
│   ├── playwright.ts                 # Playwright exports
│   ├── pages.ts                      # Page fixture definitions
│   ├── test.ts                       # Merged test fixtures
│   └── misc/
│       ├── console-error-logger.ts   # Browser console logging
│       └── screenshot.ts             # Screenshot utilities
├── pages/
│   └── todo.page.ts                  # Todo page object
├── tests/
│   ├── example.spec.ts               # Example tests (Playwright default)
│   └── todo.spec.ts                  # Main todo app tests
└── utils/
    ├── logger.ts                     # Winston logger utility
    └── timeouts.ts                   # Timeout constants
```

---

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Installation

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/todo.spec.ts

# Run tests in debug mode
npx playwright test --debug

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# List available tests
npx playwright test --list

# View HTML report
npx playwright show-report
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @playwright/test | ^1.58.1 | Test framework and browser automation |
| @types/node | ^25.1.0 | TypeScript types for Node.js |
| dotenv | ^17.2.3 | Environment variable loader |
| winston | ^3.19.0 | Structured logging library |

---

## Configuration

### Playwright Configuration (`playwright.config.ts`)

| Setting | Value | Description |
|---------|-------|-------------|
| Test Directory | `./tests` | Location of test files |
| Parallel Execution | `true` | Tests run in parallel |
| Retries (CI) | `2` | Retry failed tests twice on CI |
| Workers (CI) | `1` | Single worker on CI for stability |
| Action Timeout | `30s` | Timeout for individual actions |
| Navigation Timeout | `4 min` | Timeout for page navigation |
| Screenshot | `only-on-failure` | Capture screenshots on test failure |
| Video | `retain-on-failure` | Record video, keep only on failure |
| Trace | `on-first-retry` | Collect trace on first retry |

### Browser Projects

| Project | Description |
|---------|-------------|
| chromium | Google Chrome/Chromium |
| firefox | Mozilla Firefox |
| webkit | Safari/WebKit |

> **Note:** Mobile profiles (Pixel 5, iPhone 12) and branded browsers (Edge, Chrome) are configured but commented out.

### Environment Variables (`.env`)

```env
BASE_URL=http://localhost:3000
LOG_LEVEL=info  # Optional: debug, warn, error
```

---

## Architecture

### Fixture Composition Pattern

The framework uses Playwright's `mergeTests()` to combine multiple fixtures into a single unified test instance:

```typescript
// fixtures/test.ts
export const test = mergeTests(pagesTest, screenshotTest, createErrorLogger);
```

This provides:
- **TodoPage fixture** - Auto-instantiated page object
- **Screenshot fixture** - Visual regression testing
- **Console Error Logger** - Browser console error monitoring

### Component Hierarchy

```
Component<T>           # Base component class
├── Frame              # For iframe handling
└── GlobalComponent    # For page-level components
    └── TodoPage       # Todo application page object
```

### Page Object Pattern

Page objects encapsulate page interactions and locators:

```typescript
// pages/todo.page.ts
export class TodoPage extends GlobalComponent {
  title: Locator;
  todoInput: Locator;
  addButton: Locator;
  todoList: Locator;

  async goto(): Promise<void>;
  async addTodoItem(item: string): Promise<void>;
  async addTodoItemAndWaitForApi(item: string, timeout?: number): Promise<void>;
  getTodoItem(text: string): Locator;
  async getTodoCount(): Promise<number>;
}
```

---

## Test Suites

### Todo Tests (`tests/todo.spec.ts`)

#### Setup & Baseline
| Test | Description |
|------|-------------|
| should display the Todo List title | Verifies heading visibility |

#### Core User Journeys
| Test | Description |
|------|-------------|
| should add a new todo 'Buy milk' | Tests adding a todo item |
| should show validation when adding empty todo | Tests input validation |

#### API & Async Behavior
| Test | Description |
|------|-------------|
| should wait for POST /api/todos and update UI | Validates async API interaction |
| should load initial todos from mocked API | Tests API mocking with GET requests |
| should display error state when POST returns 500 | Tests error handling |
| should handle slow network response gracefully | Tests 1-second delayed response |

#### Edge Cases & Resilience
| Test | Description |
|------|-------------|
| should handle whitespace-only input as invalid | Input validation edge case |
| should handle special characters in todo text | XSS prevention testing |
| should handle empty todo list state | Empty state handling |

---

## Utilities

### Timeout Constants (`utils/timeouts.ts`)

```typescript
SECOND           = 1,000 ms
MINUTE           = 60,000 ms
OBSERVE_TIMEOUT  = 10 seconds
ACTION_TIMEOUT   = 30 seconds
EXPECT_TIMEOUT   = 30 seconds
DEFAULT_TIMEOUT  = 2 minutes
SLOW_TIMEOUT     = 6 minutes
LONG_TIMEOUT     = 12 minutes
PAGE_LOAD_TIMEOUT = 4 minutes
```

### Logger (`utils/logger.ts`)

Winston-based logger with console output:

```typescript
import logger from './utils/logger';

logger.info('Test started');
logger.error('[BROWSER] Console Error at url:line:column');
logger.debug('Debug information');
```

**Format:** `YYYY-MM-DD HH:mm:ss [LEVEL]: message`

---

## Fixtures

### Page Fixtures (`fixtures/pages.ts`)

Provides auto-instantiated page objects:

```typescript
import { test } from '../fixtures/test';

test('example', async ({ todoPage }) => {
  await todoPage.goto();
  await todoPage.addTodoItem('My todo');
});
```

### Screenshot Fixture (`fixtures/misc/screenshot.ts`)

Visual regression testing with consistent configuration:

```typescript
test('visual test', async ({ checkScreenshot, page }) => {
  await page.goto('/');
  await checkScreenshot(); // Full page screenshot
  await checkScreenshot(page.locator('.component')); // Component screenshot
});
```

**Options:**
- Max diff pixel ratio: 2%
- Animations: disabled
- Caret: hidden

### Console Error Logger (`fixtures/misc/console-error-logger.ts`)

Automatically logs browser console errors during tests:

- Listens to `page.on('console')` events
- Logs errors with source location (URL, line, column)
- Filters cross-origin errors intelligently
- Auto-applied fixture (runs automatically for all tests)

---

## CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/playwright.yml`)

| Step | Description |
|------|-------------|
| Checkout | Clone repository |
| Setup Node.js | Configure Node LTS |
| Install Dependencies | `npm ci` |
| Install Browsers | Playwright with system deps |
| Run Tests | `npx playwright test` |
| Upload Report | HTML report artifact (30-day retention) |

**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master`

**Configuration:**
- Runner: `ubuntu-latest`
- Timeout: 60 minutes

---

## Best Practices Implemented

### Resilient Locators

Multiple selector fallbacks for stability:

```typescript
todoList: Locator = this.page.locator('[test-id="todo-list"], ul, .todo-list');
```

### Accessible Selectors

Using role-based selectors for accessibility:

```typescript
title: Locator = this.page.getByRole('heading', { name: 'Todo List' });
addButton: Locator = this.page.getByRole('button', { name: 'Add Todo' });
```

### API Mocking

Intercepting and mocking API responses:

```typescript
await page.route('**/api/todos', async (route) => {
  if (route.request().method() === 'GET') {
    await route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, text: 'Mocked Todo' }])
    });
  }
});
```

### Response Waiting

Waiting for API responses before assertions:

```typescript
async addTodoItemAndWaitForApi(item: string, timeout = ACTION_TIMEOUT) {
  const responsePromise = this.page.waitForResponse(
    (response) => response.url().includes('/api/todos') && response.request().method() === 'POST',
    { timeout }
  );
  await this.addTodoItem(item);
  await responsePromise;
}
```

---

## Reporting

### Available Reporters

| Reporter | Description |
|----------|-------------|
| HTML | Interactive report (opens on failure) |
| List | Console output with test list |

### Viewing Reports

```bash
# After test run, open HTML report
npx playwright show-report
```

### Artifacts on CI

- HTML reports uploaded as GitHub Actions artifacts
- Retention: 30 days
- Includes screenshots and videos for failed tests

---

## Extending the Framework

### Adding a New Page Object

1. Create file in `pages/` directory
2. Extend `GlobalComponent`
3. Define locators and methods
4. Add to `fixtures/pages.ts`

```typescript
// pages/login.page.ts
import { Locator } from '../fixtures/playwright';
import { GlobalComponent } from '../components';

export class LoginPage extends GlobalComponent {
  usernameInput: Locator = this.page.getByLabel('Username');
  passwordInput: Locator = this.page.getByLabel('Password');
  submitButton: Locator = this.page.getByRole('button', { name: 'Login' });

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Adding a New Fixture

1. Create fixture in `fixtures/` or `fixtures/misc/`
2. Define fixture using `test.extend()`
3. Merge into main test in `fixtures/test.ts`

```typescript
// fixtures/misc/auth.ts
import { test as base } from '@playwright/test';

export const authTest = base.extend<{ authenticate: () => Promise<void> }>({
  authenticate: async ({ page }, use) => {
    await use(async () => {
      // Authentication logic
    });
  },
});
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Tests failing on CI but passing locally | Check for hardcoded waits, use `waitFor` methods |
| Flaky tests | Increase timeouts, add proper wait conditions |
| Element not found | Verify selectors, check for dynamic loading |
| API mocking not working | Ensure route pattern matches actual URL |

### Debug Mode

```bash
# Run with Playwright Inspector
npx playwright test --debug

# Run with headed browser
npx playwright test --headed

# Collect trace for debugging
npx playwright test --trace on
```

### Logs

Check browser console errors in test output (logged by console-error-logger fixture).

---

## Test Coverage Summary

| Category | Tests | Description |
|----------|-------|-------------|
| Baseline | 1 | Page title verification |
| Core Functionality | 2 | Adding todos, validation |
| API Integration | 4 | Mocking, waiting, error states |
| Edge Cases | 3 | Whitespace, XSS, empty states |
| **Total** | **10+** | Comprehensive coverage |

---

## Contributing

1. Create feature branch from `master`
2. Follow existing patterns for page objects and fixtures
3. Add tests for new functionality
4. Ensure all tests pass locally
5. Create pull request

---

## License

This project is part of a QA challenge assessment.
