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
Cypress.Commands.add('setupNoAuth', () => {
  cy.intercept('GET', '**/api/v1/**', (req) => {
    req.reply(authFixtures.apiResponses.success);
  }).as('noAuthRequest');
});

// Configure Chroma server with token authentication
Cypress.Commands.add('setupTokenAuth', (token = authFixtures.credentials.tokenAuth.token) => {
  cy.intercept('GET', '**/api/v1/**', (req) => {
    const authHeader = req.headers['authorization'];
    const expectedAuth = `Bearer ${token}`;
    if (!authHeader || authHeader !== expectedAuth) {
      req.reply(authFixtures.apiResponses.unauthorized);
      return;
    }
    req.reply(authFixtures.apiResponses.success);
  }).as('tokenAuthRequest');
});

// Configure Chroma server with basic authentication
Cypress.Commands.add('setupBasicAuth', (
  username = authFixtures.credentials.basicAuth.username,
  password = authFixtures.credentials.basicAuth.password
) => {
  cy.intercept('GET', '**/api/v1/**', (req) => {
    const authHeader = req.headers['authorization'];
    const expectedAuth = `Basic ${btoa(`${username}:${password}`)}`;
    if (!authHeader || authHeader !== expectedAuth) {
      req.reply(authFixtures.apiResponses.unauthorized);
      return;
    }
    req.reply(authFixtures.apiResponses.success);
  }).as('basicAuthRequest');
});

export {};
