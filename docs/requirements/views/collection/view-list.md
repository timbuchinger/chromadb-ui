# Collection Screen

As a user, I want to be able to view the documents in my collections on a dedicated screen.

## Technical Requirements

1. Accessed via /collection/:name route
2. Paging should be implemented to limit the results to 20 per page
3. A 'back' link near the top allows the user to navigate back to the collections list
4. All input fields should have consistent padding (matches login screen)

## Acceptance Criteria

1. A list of documents is shown with a row for each document
2. The fields shown for each document are id, metadata and document
  a. The metadata and document fields will need to be truncated, and should have '...' as a suffix when they have been truncated
3. The row should be clickable and will open a modal with the document content
4. The count of documents in the collection is shown
5. Adding new documents:
  a. Opens in a modal
  b. Input fields have consistent padding with other forms
  c. Optional ID field (generates UUID if not provided)
  d. Required content field
  e. Optional metadata with dynamic key/value pairs
