# Testing Guide

This document provides guidelines and instructions for testing the ChromaDB UI application.

## Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Coverage](#coverage)
- [Best Practices](#best-practices)

## Overview

The ChromaDB UI uses [Vitest](https://vitest.dev/) as the primary test runner for unit and integration tests. We also use [Cypress](https://www.cypress.io/) for end-to-end tests that require a real browser environment.

### Test Stack

- **Vitest**: Fast unit test runner with Vue support
- **@vue/test-utils**: Vue component testing utilities
- **happy-dom**: Fast DOM implementation for testing
- **Cypress**: E2E testing for browser-specific scenarios

## Running Tests

### Unit Tests

```bash
# Run all unit tests once
npm run test:unit:run

# Run tests in watch mode (for development)
npm run test:unit

# Run tests with the Vitest UI
npm run test:unit:ui

# Run tests with coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Open Cypress test runner
npm run cy:open

# Run Cypress tests headlessly
npm run cy:run

# Run E2E tests (starts dev server and runs tests)
npm run test:e2e

# Run E2E tests in development mode (with Cypress UI)
npm run test:e2e:dev
```

## Test Structure

### Directory Layout

```plaintext
chromadb-ui/
├── src/
│   ├── components/
│   │   └── __tests__/           # Component tests (co-located)
│   │       ├── ThemeToggle.test.ts
│   │       ├── LoadingSpinner.test.ts
│   │       └── NotificationList.test.ts
│   └── composables/
│       └── __tests__/           # Composable tests (co-located)
│           ├── useTheme.test.ts
│           ├── useDocumentValidation.test.ts
│           ├── useKeyboardShortcuts.test.ts
│           └── useKeyboardNavigation.test.ts
├── tests/
│   ├── setup.ts                 # Global test setup
│   ├── unit/
│   │   ├── stores/              # Pinia store tests
│   │   │   ├── auth.test.ts
│   │   │   ├── loading.test.ts
│   │   │   └── notifications.test.ts
│   │   └── utils/               # Utility function tests
│   │       └── documentTypes.test.ts
│   └── utils/                   # Test utilities
│       ├── factories.ts         # Test data factories
│       ├── mocks.ts             # Mock utilities
│       └── renderWithProviders.ts  # Component mount helper
└── cypress/
    ├── e2e/                     # E2E test specs
    └── support/                 # Cypress support files
```

### Naming Conventions

- Test files should be named `*.test.ts` or `*.spec.ts`
- Co-locate component tests in `__tests__` directories
- Store and utility tests go in `tests/unit/`

## Writing Tests

### Component Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test
    setActivePinia(createPinia())
  })

  it('should render correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should emit event when clicked', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Store Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '../../../src/stores/myStore'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('should have correct initial state', () => {
    const store = useMyStore()
    expect(store.someValue).toBe('default')
  })

  it('should update state on action', async () => {
    const store = useMyStore()
    await store.someAction()
    expect(store.someValue).toBe('updated')
  })
})
```

### Composable Tests

```typescript
import { describe, it, expect } from 'vitest'
import { useMyComposable } from '../useMyComposable'

describe('useMyComposable', () => {
  it('should return expected values', () => {
    const { value, doSomething } = useMyComposable()
    expect(value.value).toBe('initial')
    
    doSomething()
    expect(value.value).toBe('updated')
  })
})
```

## Test Utilities

### Factories

Create test data using factories to keep tests readable:

```typescript
import { createCollection, createDocument } from '../../utils/factories'

it('should display collection', () => {
  const collection = createCollection({ name: 'test-collection' })
  // Use collection in test...
})
```

### Mocks

Use mock utilities for external dependencies:

```typescript
import { createMockApiClient, createMockRouter } from '../../utils/mocks'

it('should call API', async () => {
  const mockApi = createMockApiClient()
  mockApi.get.mockResolvedValue({ data: { items: [] } })
  // Use mockApi in test...
})
```

### renderWithProviders

For integration tests that need router and Pinia:

```typescript
import { renderWithProviders } from '../../utils/renderWithProviders'
import MyScreen from '../MyScreen.vue'

it('should render with providers', async () => {
  const { wrapper, router, pinia } = await renderWithProviders(MyScreen, {
    initialRoute: '/collections',
    initialStoreState: {
      auth: { isAuthenticated: true }
    }
  })
  // wrapper is mounted with router and pinia
})
```

## Coverage

### Coverage Thresholds

The project enforces the following coverage thresholds:

| Metric | Threshold |
|--------|-----------|
| Statements | 80% |
| Lines | 80% |
| Functions | 80% |
| Branches | 75% |

### Generating Coverage Reports

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory:

- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format for CI tools

## Best Practices

### Do's

- ✅ Write tests before or alongside code changes
- ✅ Keep tests focused on one behavior
- ✅ Use descriptive test names that explain the expected behavior
- ✅ Create fresh Pinia instances in `beforeEach` for store tests
- ✅ Clean up mocks in `afterEach` using `vi.restoreAllMocks()`
- ✅ Use fake timers for time-dependent tests
- ✅ Test both success and error paths
- ✅ Test accessibility attributes (aria-*, role, etc.)

### Don'ts

- ❌ Don't test implementation details
- ❌ Don't rely on test execution order
- ❌ Don't use real timers in tests
- ❌ Don't make actual network requests
- ❌ Don't share state between tests
- ❌ Don't test Vue/Pinia framework internals

### Testing Async Code

Use `vi.useFakeTimers()` for timeout-based code:

```typescript
import { vi, beforeEach, afterEach } from 'vitest'

describe('Async behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should auto-dismiss after timeout', () => {
    // ... setup ...
    vi.advanceTimersByTime(10000)
    // ... assertions ...
  })
})
```

### Mocking Modules

```typescript
import { vi } from 'vitest'
import * as myModule from '../myModule'

// Mock entire module
vi.mock('../myModule', () => ({
  myFunction: vi.fn().mockReturnValue('mocked')
}))

// Or spy on specific function
vi.spyOn(myModule, 'myFunction').mockReturnValue('mocked')
```

## Debugging Tests

### Running Specific Tests

```bash
# Run tests matching a pattern
npm run test:unit:run -- -t "should render"

# Run a specific file
npm run test:unit:run -- src/components/__tests__/ThemeToggle.test.ts
```

### Using the Vitest UI

```bash
npm run test:unit:ui
```

This opens an interactive UI where you can:

- View test results in real-time
- Re-run individual tests
- See code coverage
- Debug failing tests

### Console Output

Add `console.log` statements in tests, or use the `--reporter=verbose` flag:

```bash
npm run test:unit:run -- --reporter=verbose
```

## CI Integration

Tests run automatically in GitHub Actions on:

- Push to `main` branch
- Pull requests to `main` branch

The CI pipeline:

1. Runs linting (`npm run lint`)
2. Runs unit tests (`npm run test:unit:run`)
3. Runs E2E tests with Cypress
4. Builds Docker image

Coverage reports are generated but not currently enforced in CI. To enable threshold enforcement, the test command in CI could use:

```bash
npm run test:coverage
```

Which will fail if coverage drops below the configured thresholds.
