# Notifications System

As a user, I want to receive important notifications.

## Technical Notes

The notification system should be useable throughout the app so that when errors or other important information arrises, the user can be notified.
There will be four levels of notifications that can be sent - Success, Info, Warning and Error. Each will have a corresponding color.

Example use-cases:
Action: A user successfully deletes a collection
Result: A success notification is displayed.

Action: A user attempts to delete a collection, but an error is encountered.
Result: An error notification is displayed.

## Acceptance Criteria

1. Notifications should dissappear automatically after 10 seconds.
2. The user should be able to remove the notification by clicking a close button in the top right corner of the notification.
