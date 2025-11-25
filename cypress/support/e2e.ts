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
  cy.intercept({
    url: '**/api/v1/**'
  }, (req) => {
    // Only process if not already handled by a more specific interceptor
    if (!req.alias || req.alias === 'noAuthRequest') {
      req.url = req.url.replace(/(:\d+)\//, ':8001/');
      req.reply({
        statusCode: 200,
        body: []
      });
    }
  }).as('noAuthRequest');
});

export {};
