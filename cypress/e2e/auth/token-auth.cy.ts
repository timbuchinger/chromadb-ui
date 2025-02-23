describe('Token Auth Mode', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should fail without token', () => {
    // Setup with no token
    cy.setupTokenAuth('invalid-token');

    // Select token auth
    cy.get('input[type="radio"][value="token"]').check();

    // Enter invalid token
    cy.get('input[type="password"][placeholder="API Token"]').type('invalid-token');

    // Click connect
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.get('[data-test="error-message"]').should('be.visible');
    cy.get('[data-test="collections-screen"]').should('not.exist');
  });

  it('should succeed with valid token', () => {
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

    // Verify API calls are authenticated
    cy.wait('@tokenAuthRequest').then((interception) => {
      expect(interception.request.headers['Authorization']).to.equal('Bearer test-token');
      expect(interception.response?.statusCode).to.equal(200);
    });
  });

  it('should maintain token auth across navigation', () => {
    cy.setupTokenAuth();

    // Select token auth
    cy.get('input[type="radio"][value="token"]').check();

    // Enter valid token
    cy.get('input[type="password"][placeholder="API Token"]').type('test-token');

    // Click connect
    cy.get('button[type="submit"]').click();

    // Initial load
    cy.get('[data-test="collections-screen"]').should('be.visible');

    const collectionId = 'token-test-collection-id';
    const collectionName = 'token-test-collection';
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
    cy.intercept('DELETE', `**/api/v1/collections/${collectionId}*`, {
      statusCode: 200,
      body: {}
    }).as('deleteCollection');

    // Create a collection
    cy.get('[data-test="add-collection-button"]').click();
    cy.get('[data-test="collection-name-input"]').type('token-test-collection');
    cy.get('[data-test="create-collection-submit"]').click();

    // Wait for creation API call and verify
    cy.wait('@createCollection').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });

    // Wait for collection to appear and modal to close
    cy.get('[data-test="collections-list"]')
      .contains('token-test-collection')
      .should('be.visible');
    cy.get('div.fixed.inset-0.z-50.overflow-y-auto').should('not.exist');

    // Navigate and verify token is maintained
    cy.get('[data-test="collection-row"]').first().find('button').first().click();
    cy.url().should('include', '/collection/');

    // All requests should include token
    cy.get('@tokenAuthRequest.all').then((interceptions) => {
      interceptions.forEach((interception) => {
        expect(interception.request.headers['Authorization']).to.equal('Bearer test-token');
      });
    });

    // Navigate back to collections screen
    cy.get('[data-test="navbar-home"]').click();

    // Setup interceptors for delete flow
    cy.intercept('DELETE', `**/api/v1/collections/${collectionId}*`, {
      statusCode: 200,
      body: {}
    }).as('deleteCollection');

    // Set up empty collections response for after delete
    cy.intercept('GET', '**/api/v1/collections*', {
      statusCode: 200,
      body: []
    }).as('emptyCollections');
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
});
