/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Configure Chroma server for API mocking
       */
      setupNoAuth(): Chainable<void>
    }
  }
}

// Configure Chroma server for API mocking
Cypress.Commands.add('setupNoAuth', () => {
  cy.intercept('**/api/v1/**', (req) => {
    req.url = req.url.replace(/(:\d+)\//, ':8001/');
    req.continue();
  }).as('noAuthRequest');
});

export {};
