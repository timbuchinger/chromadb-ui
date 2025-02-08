# Login Screen

As a user, I want to be able to authenticate with my ChromaDB instance, so that I can use the app to browse my collections.

## Technical Requirements

1. The login should support token and basic authentication methods with a third option for no authentication.
  a. When token authentication is selected, a token text box is shown.
  b. When basic authentication is selected, username and password text boxes are shown.
  c. When no authentication is selected, no text boxes for authentication are shown.
2. The login should support http and https protocols
3. Use a placeholder value in the server URL text box of '<http://localhost:8000>'
4. A tenant text box is available with the default value 'default_tenant'.
5. A database text box is available with the default value 'default_database'.

## Acceptance Criteria

1. If a user attempts to navigate to another screen without being authenticated, they will be redirected to the login screen.
2. When the user attempts to login, they are authenticated with the ChromaDB API.
