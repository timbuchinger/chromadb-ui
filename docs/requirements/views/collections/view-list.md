# Collections Screen

As a user, I want to view a list of Chroma collections in my database.

## Technical Notes

1. Paging should be implemented to limit the results to 20 per page.

## Acceptance Criteria

1. The list of Chroma collections for the selected tenant and database is shown.
2. Each collection has a button to view the collection and a button to delete the collection.
  a. The view button loads the collection screen with the selected collection.
    i. The collection name should be a link and should take you to the same location.
  b. The delete button asks the user for confirmation before deleting the collection.
    i. Once deleted, the collection list should be refreshed to reflect the changes.
3. When no collections are present, present a message that says 'There are no collections.'.
