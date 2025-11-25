/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Configure Chroma server for API mocking (no auth)
       */
      setupNoAuth(): Chainable<void>
      /**
       * Configure Chroma server for token-based auth API mocking
       */
      setupTokenAuth(): Chainable<void>
    }
  }
}

// Configure Chroma server for API mocking (no auth)
Cypress.Commands.add('setupNoAuth', () => {
  cy.intercept('**/api/v1/**', (req) => {
    req.url = req.url.replace(/(:\d+)\//, ':8001/');
    req.continue();
  }).as('noAuthRequest');
});

// Configure Chroma server for token-based auth API mocking
Cypress.Commands.add('setupTokenAuth', () => {
  // Mock the collections endpoint to succeed with token auth
  cy.intercept('GET', '**/api/v1/collections*', {
    statusCode: 200,
    body: []
  }).as('tokenAuthRequest');
});

export {};
