# Collections Screen

As a user, I want to be able to create a collection from the UI.

## Technical Notes

1. 'Name' is the only attribute the user provides when a collection is created
2. Collection name input must have consistent padding with other input fields (matches login screen)

## User Interface

1. Adding a collection opens in a modal with:
   a. Input field for collection name
   b. Validation message area
   c. Create and Cancel buttons

## Acceptance Criteria

1. An add button is present on the collections screen
2. Duplicate collections are not allowed
3. Only lower case letters, numbers, dashes and underscores are allowed in the name
4. When a new collection is added, the list of collections is refreshed to reflect the new addition
5. Input field styling matches other forms in the application
