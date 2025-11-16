/// <reference types="cypress" />

import '../../support/e2e';

describe('Session Recovery and Security', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should persist authentication across page reload', () => {
    // Setup with valid token
    cy.setupTokenAuth();

    // Select token auth
    cy.get('input[type="radio"][value="token"]').check();

    // Enter valid token
    cy.get('input[type="password"][placeholder="API Token"]').type('test-token');

    // Click connect
    cy.get('button[type="submit"]').click();

    // Should show collections screen
    cy.get('[data-test="collections-screen"]').should('be.visible');

    // Reload the page
    cy.reload();

    // Should still be authenticated and on collections screen
    cy.get('[data-test="collections-screen"]').should('be.visible');
    cy.url().should('not.include', '/login');
  });

  it('should restore last visited route after page reload', () => {
    cy.setupTokenAuth();

    // Login
    cy.get('input[type="radio"][value="token"]').check();
    cy.get('input[type="password"][placeholder="API Token"]').type('test-token');
    cy.get('button[type="submit"]').click();

    // Navigate to collections screen
    cy.get('[data-test="collections-screen"]').should('be.visible');

    const collectionId = 'test-collection-id';
    const collectionName = 'test-collection';

    // Setup API mocks for collection
    cy.intercept('GET', `**/api/v1/collections/${collectionId}*`, {
      statusCode: 200,
      body: { id: collectionId, name: collectionName }
    }).as('getCollection');

    cy.intercept('GET', '**/api/v1/collections*', {
      statusCode: 200,
      body: [{ id: collectionId, name: collectionName }]
    }).as('getCollections');

    // Wait for collections to load
    cy.wait('@getCollections');

    // Navigate to a specific collection
    cy.get('[data-test="collection-row"]').first().find('button').first().click();
    cy.url().should('include', '/collection/');

    // Reload the page
    cy.reload();

    // Should be redirected back to the collection page after reload
    cy.url().should('include', '/collection/');
  });

  it('should show error notification for backend authentication failures', () => {
    // Setup with failing auth
    cy.intercept('GET', '**/api/v1/collections*', {
      statusCode: 401,
      body: 'Unauthorized'
    }).as('failedAuth');

    // Select token auth
    cy.get('input[type="radio"][value="token"]').check();

    // Enter invalid token
    cy.get('input[type="password"][placeholder="API Token"]').type('invalid-token');

    // Click connect
    cy.get('button[type="submit"]').click();

    // Should show error notification
    cy.get('[role="status"]').should('contain', 'Authentication failed');
    
    // Should also show inline error message
    cy.get('[data-test="error-message"]').should('be.visible');
  });

  it('should clear authentication on logout', () => {
    cy.setupTokenAuth();

    // Login
    cy.get('input[type="radio"][value="token"]').check();
    cy.get('input[type="password"][placeholder="API Token"]').type('test-token');
    cy.get('button[type="submit"]').click();

    // Should show collections screen
    cy.get('[data-test="collections-screen"]').should('be.visible');

    // Logout
    cy.get('[data-test="navbar-logout"]').click();

    // Should redirect to login
    cy.url().should('include', '/login');

    // Reload the page
    cy.reload();

    // Should still be on login page (session not restored)
    cy.url().should('include', '/login');
  });
});
