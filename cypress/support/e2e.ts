/// <reference types="cypress" />

import { authFixtures } from '../fixtures/auth'

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
// Routes requests to no-auth Docker container on port 8001
Cypress.Commands.add('setupNoAuth', () => {
  cy.intercept('**/api/v1/**', (req) => {
    req.url = req.url.replace(/(:\d+)\//, ':8001/');
    req.continue();
  }).as('noAuthRequest');
});

// Configure Chroma server with token authentication  
// Routes requests to token-auth Docker container on port 8002
Cypress.Commands.add('setupTokenAuth', (token = authFixtures.credentials.tokenAuth.token) => {
  cy.intercept('**/api/v1/**', (req) => {
    const authHeader = req.headers['authorization'];
    const expectedAuth = `Bearer ${token}`;
    if (!authHeader || authHeader !== expectedAuth) {
      req.reply(authFixtures.apiResponses.unauthorized);
      return;
    }
    req.url = req.url.replace(/(:\d+)\//, ':8002/');
    req.continue();
  }).as('tokenAuthRequest');
});

// Configure Chroma server with basic authentication
// Routes requests to basic-auth Docker container on port 8003
Cypress.Commands.add('setupBasicAuth', (
  username = authFixtures.credentials.basicAuth.username,
  password = authFixtures.credentials.basicAuth.password
) => {
  cy.intercept('**/api/v1/**', (req) => {
    const authHeader = req.headers['authorization'];
    const expectedAuth = `Basic ${btoa(`${username}:${password}`)}`;
    if (!authHeader || authHeader !== expectedAuth) {
      req.reply(authFixtures.apiResponses.unauthorized);
      return;
    }
    req.url = req.url.replace(/(:\d+)\//, ':8003/');
    req.continue();
  }).as('basicAuthRequest');
});

export {};
