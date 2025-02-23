/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Configure Chroma server without authentication
       */
      setupNoAuth(): Chainable<void>
      /**
       * Configure Chroma server with token authentication
       * @param token - Optional token to use, defaults to 'test-token'
       */
      setupTokenAuth(token?: string): Chainable<void>
      /**
       * Configure Chroma server with basic authentication
       * @param username - Optional username to use, defaults to 'admin'
       * @param password - Optional password to use, defaults to 'admin'
       */
      setupBasicAuth(username?: string, password?: string): Chainable<void>
    }
  }
}

// Configure Chroma server without authentication
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

// Configure Chroma server with token authentication
Cypress.Commands.add('setupTokenAuth', (token = 'test-token') => {
  cy.intercept({
    url: '**/api/v1/**'
  }, (req) => {
    // Only process if not already handled by a more specific interceptor
    if (!req.alias || req.alias === 'tokenAuthRequest') {
      const authHeader = req.headers['authorization'];
      const expectedAuth = `Bearer test-token`;
      if (!authHeader || authHeader !== expectedAuth) {
        req.reply({
          statusCode: 401,
          body: { error: 'Invalid token' }
        });
        return;
      }
      req.headers['Authorization'] = `Bearer ${token}`;
      req.url = req.url.replace(/(:\d+)\//, ':8002/');
      req.reply({
        statusCode: 200,
        body: []
      });
    }
  }).as('tokenAuthRequest');
});

// Configure Chroma server with basic authentication
Cypress.Commands.add('setupBasicAuth', (username = 'admin', password = 'admin') => {
  cy.intercept({
    url: '**/api/v1/**'
  }, (req) => {
    // Only process if not already handled by a more specific interceptor
    if (!req.alias || req.alias === 'basicAuthRequest') {
      const authHeader = req.headers['authorization'];
      const expectedAuth = `Basic ${btoa('admin:admin')}`;
      if (!authHeader || authHeader !== expectedAuth) {
        req.reply({
          statusCode: 401,
          body: { error: 'Invalid credentials' }
        });
        return;
      }
      req.headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
      req.url = req.url.replace(/(:\d+)\//, ':8003/');
      req.reply({
        statusCode: 200,
        body: []
      });
    }
  }).as('basicAuthRequest');
});

export {};
