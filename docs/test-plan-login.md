# Login Screen Test Plan

## Setup Requirements

1. Install Cypress and configure for Vue + TypeScript:
```bash
npm install -D cypress @testing-library/cypress
```

2. Add scripts to package.json:
```json
{
  "scripts": {
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run"
  }
}
```

3. Initialize Cypress config with TypeScript support:
```bash
npx cypress open
```

## Test Implementation Plan

Create test file at `cypress/e2e/login.cy.ts`:

```typescript
describe('Login Screen', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the login screen with expected elements', () => {
    // Verify no console errors occur during load
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError')
    })

    // Verify heading
    cy.contains('h2', 'Connect to ChromaDB').should('be.visible')
    
    // Verify server URL field with default value
    cy.get('input[type="text"]').first().should('have.value', 'localhost:8000')
    
    // Verify auth type options exist
    cy.get('input[type="radio"]').should('have.length', 3)
    cy.contains('span', 'No Auth').should('be.visible')

    // Verify no console errors occurred
    cy.get('@consoleError').should('not.have.been.called')
  })

  it('should allow login with no auth option', () => {
    // Monitor console errors
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError')
    })

    // Select no auth option
    cy.contains('label', 'No Auth').click()
    
    // Default values should be set for tenant/database
    cy.get('input[placeholder="Tenant"]').should('have.value', 'default_tenant')
    cy.get('input[placeholder="Database"]').should('have.value', 'default_database')
    
    // Submit form
    cy.contains('button', 'Connect').click()
    
    // Should navigate to collections screen
    cy.url().should('include', '/')

    // Verify no console errors occurred during login process
    cy.get('@consoleError').should('not.have.been.called')
  })
})
```

## Additional Configuration

1. Add Cypress types to tsconfig.json:
```json
{
  "compilerOptions": {
    "types": ["cypress", "@testing-library/cypress"]
  }
}
```

2. Configure Cypress for Vue application in cypress.config.ts:
```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false
  },
})
```

## Implementation Steps

1. Install dependencies
2. Initialize Cypress and create config
3. Implement test file
4. Add necessary type configurations
5. Test and verify functionality

## Note

The test assumes:
- Dev server runs on default Vite port 5173
- Login screen is the initial route
- No auth option works with default tenant/database values