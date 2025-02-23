describe('No Auth Mode', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.setupNoAuth();
  });

  it('should connect without credentials', () => {
    // Select No Auth option
    cy.get('input[type="radio"][value="none"]').check();

    // Click Connect button
    cy.get('button[type="submit"]').click();

    // Should show collections screen after connecting
    cy.get('[data-test="collections-screen"]').should('be.visible');
  });

  it('should be able to create and delete a collection', () => {
    // Select No Auth option and connect
    cy.get('input[type="radio"][value="none"]').check();
    cy.get('button[type="submit"]').click();
    cy.get('[data-test="collections-screen"]').should('be.visible');

    const collectionId = 'test-collection-id';
    const collectionName = 'test-collection';
    const emptyCollections = { statusCode: 200, body: [] };
    const singleCollection = {
      statusCode: 200,
      body: [{
        id: collectionId,
        name: collectionName
      }]
    };

    // Setup all API mocks
    cy.intercept('GET', '**/api/v1/collections*', emptyCollections).as('getCollections');
    cy.intercept('POST', '**/api/v1/collections', {
      statusCode: 200,
      body: { id: collectionId, name: collectionName }
    }).as('createCollection');
    cy.intercept('GET', '**/api/v1/collections*', singleCollection).as('getCollectionsAfterCreate');
    cy.intercept('GET', `**/api/v1/collections/${collectionId}*`, {
      statusCode: 200,
      body: { id: collectionId, name: collectionName }
    }).as('getCollection');
    cy.intercept('DELETE', `**/api/v1/collections/${collectionName}*`, {
      statusCode: 200,
      body: {}
    }).as('deleteCollection');

    // Create collection
    cy.get('[data-test="add-collection-button"]').click();
    cy.get('[data-test="collection-name-input"]').type('test-collection');
    cy.get('[data-test="create-collection-submit"]').click();

    // Wait for creation API call and verify
    cy.wait('@createCollection').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Wait for collection to appear and modal to close
    cy.get('[data-test="collections-list"]')
      .contains('test-collection')
      .should('be.visible');
    cy.get('div.fixed.inset-0.z-50.overflow-y-auto').should('not.exist');

    // Navigate to view and back
    cy.get('[data-test="collection-row"]').first().find('button').first().click();
    cy.url().should('include', '/collection/');

    // Navigate back to collections screen
    cy.get('[data-test="navbar-home"]').click();

    // Setup interceptors for delete flow
    cy.intercept('DELETE', `**/api/v1/collections/${collectionName}*`, {
      statusCode: 200,
      body: {}
    }).as('deleteCollection');

    // Set up empty collections response for after delete
    cy.intercept('GET', '**/api/v1/collections*', {
      statusCode: 200,
      body: []
    }).as('emptyCollections');

    // Delete collection
    cy.get('[data-test="collection-delete-button"]').should('be.visible').first().click();
    cy.get('[data-test="confirm-delete-button"]').click();

    // Wait for deletion success
    cy.wait('@deleteCollection').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Wait for loading state to finish
    cy.get('[data-test="add-collection-button"]')
      .should('be.visible')
      .and('not.be.disabled');

    // Verify collection is gone
    cy.get('[data-test="collections-screen"]')
      .find('[data-test="collection-row"]')
      .should('have.length', 0);
    cy.get('div.fixed.inset-0.z-50.overflow-y-auto').should('not.exist');
  });

  it('should maintain connection for multiple operations', () => {
    // Select No Auth option and connect
    cy.get('input[type="radio"][value="none"]').check();
    cy.get('button[type="submit"]').click();

    cy.get('[data-test="collections-screen"]').should('be.visible');

    // Navigate to a different route and back
    cy.get('[data-test="navbar-home"]').click();
    cy.get('[data-test="collections-screen"]').should('be.visible');

    // Check if API calls are still working
    cy.wait('@noAuthRequest').its('response.statusCode').should('eq', 200);
  });
});
