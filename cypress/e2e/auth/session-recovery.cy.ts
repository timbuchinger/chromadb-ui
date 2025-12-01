/// <reference types="cypress" />

import '../../support/e2e';

describe('Session Recovery and Security', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should persist authentication across page reload', () => {
    // Setup API mocking
    cy.setupTokenAuth();

    // Click connect (using default server settings)
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
    const collectionId = 'test-collection-id';
    const collectionName = 'test-collection';

    // Setup API mocks before login
    cy.intercept('GET', '**/api/v2/heartbeat*', {
      statusCode: 200,
      body: { 'nanosecond heartbeat': Date.now() * 1000000 }
    }).as('heartbeat');

    cy.intercept('GET', '**/api/v2/**/collections*', {
      statusCode: 200,
      body: [{ id: collectionId, name: collectionName }]
    }).as('getCollections');

    cy.intercept('GET', `**/api/v2/**/collections/${collectionId}*`, {
      statusCode: 200,
      body: { id: collectionId, name: collectionName }
    }).as('getCollection');

    // Login
    cy.get('button[type="submit"]').click();

    // Navigate to collections screen
    cy.get('[data-test="collections-screen"]').should('be.visible');

    // Wait for collections to load
    cy.get('[data-test="collection-row"]').should('have.length', 1);

    // Navigate to a specific collection
    cy.get('[data-test="collection-row"]').first().find('button').first().click();
    cy.url().should('include', '/collection/');

    // Reload the page
    cy.reload();

    // Should be redirected back to the collection page after reload
    cy.url().should('include', '/collection/');
  });

  it('should show error message for connection failures', () => {
    // Setup with failing connection
    cy.intercept('GET', '**/api/v2/collections*', {
      statusCode: 500,
      body: { error: 'Connection failed' }
    }).as('failedConnection');

    // Click connect
    cy.get('button[type="submit"]').click();

    // Should show inline error message
    cy.get('[data-test="error-message"]').should('be.visible');
  });

  it('should clear authentication on logout', () => {
    cy.setupTokenAuth();

    // Login
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
